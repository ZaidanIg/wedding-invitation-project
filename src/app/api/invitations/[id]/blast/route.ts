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
        userId: session.user.id,
      },
    });

    if (!invitation) {
      return errorResponse('Undangan tidak ditemukan atau Anda tidak memiliki akses.', 404, 'NOT_FOUND');
    }

    // WA Blast is exclusive to ULTIMATE tier
    const isAllowedTier = invitation.tier === 'ULTIMATE';
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

    // 5. Send message via Fonnte with 15-second dispatch delay/throttle backend guardrail
    try {
      await new Promise((resolve) => setTimeout(resolve, 15000));
      await sendWhatsAppMessage(guest.phone, message);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : '';
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
