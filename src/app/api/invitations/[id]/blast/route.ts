import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const blastInputSchema = z.object({
  guestId: z.string().min(1, 'ID Tamu wajib diisi'),
  message: z.string().min(1, 'Isi pesan wajib diisi'),
});

export async function POST(request: Request, { params }: RouteParams) {
  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { id } = await params;

    // 2. Parse and validate input body safely
    const body = await request.json().catch(() => ({}));
    const parsedInput = blastInputSchema.safeParse(body);
    if (!parsedInput.success) {
      const errorMsg = parsedInput.error.issues.map((e) => e.message).join(', ');
      return errorResponse(errorMsg, 400, 'VALIDATION_ERROR');
    }

    const { guestId, message } = parsedInput.data;

    // 3. Find invitation and verify ownership + tier
    const invitation = await prisma.invitation.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        project: {
          agency: {
            ownerId: session.user.id,
          },
        },
      },
    });

    if (!invitation) {
      return errorResponse('Undangan tidak ditemukan atau Anda tidak memiliki akses.', 404, 'NOT_FOUND');
    }

    // Get the user's latest accountType
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    const isB2B = user?.accountType === 'B2B_PRO' || user?.accountType === 'B2B_ALL_TIME';

    // WA Blast is exclusive to ULTIMATE tier, B2B generated tiers, or any invitation owned by a B2B user
    const isAllowedTier = invitation.tier === 'ULTIMATE' || invitation.tier === 'B2B_GENERATED' || isB2B;
    if (!isAllowedTier) {
      return errorResponse(
        'Fitur WhatsApp Blast otomatis hanya tersedia untuk Paket Ultimate.',
        403,
        'FORBIDDEN'
      );
    }

    // 4. Find guest belonging to this invitation
    const guest = await prisma.guest.findFirst({
      where: {
        id: guestId,
        invitationId: invitation.id,
      },
    });

    if (!guest) {
      return errorResponse('Tamu tidak ditemukan dalam daftar undangan ini.', 404, 'NOT_FOUND');
    }

    if (!guest.phone) {
      return errorResponse(`Tamu ${guest.name} tidak memiliki nomor WhatsApp yang valid.`, 400, 'BAD_REQUEST');
    }

    // 5. Send message via Fonnte
    try {
      await sendWhatsAppMessage(guest.phone, message);
    } catch (err: any) {
      const errMsg = err.message || '';
      if (
        errMsg.includes('disconnected device') || 
        errMsg.includes('device disconnected') || 
        errMsg.includes('invalid on disconnected')
      ) {
        return errorResponse(
          'Perangkat WhatsApp Gateway (Fonnte) Anda sedang terputus/offline. Silakan login ke dasbor Fonnte dan sambungkan perangkat Anda.',
          503,
          'GATEWAY_DISCONNECTED'
        );
      }
      throw err;
    }

    return successResponse(null, `Pesan berhasil dikirim ke ${guest.name}`);
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
