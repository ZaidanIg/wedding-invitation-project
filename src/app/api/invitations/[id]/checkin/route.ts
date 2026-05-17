import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { guestId } = await request.json();
    if (!guestId) {
      return NextResponse.json({ success: false, error: 'Guest ID required' }, { status: 400 });
    }

    // Verify invitation belongs to user and guest belongs to invitation
    // Note: params.id could be slug or actual ID depending on caller
    const guest = await prisma.guest.findFirst({
      where: {
        id: guestId,
        invitation: {
          OR: [
            { id: params.id },
            { slug: params.id }
          ],
          userId: session.user.id
        }
      },

      include: {
        invitation: true
      }
    });

    if (!guest) {
      return NextResponse.json({ success: false, error: 'Guest not found or unauthorized' }, { status: 404 });
    }

    if (guest.checkedIn) {
      return NextResponse.json({ 
        success: false, 
        error: `Tamu sudah check-in pada ${guest.updatedAt.toLocaleTimeString()}`,
        data: guest
      }, { status: 400 });
    }

    // Mark as checked in
    const updatedGuest = await prisma.guest.update({
      where: { id: guestId },
      data: { 
        checkedIn: true,
        rsvpStatus: 'ATTENDING' // Force attending if they scanned QR
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedGuest
    });
  } catch (error) {
    console.error('[Check-in Error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to process check-in' }, { status: 500 });
  }
}
