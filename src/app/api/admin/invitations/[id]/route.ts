// GET  /api/admin/invitations/[id] — Get single invitation detail
// PATCH /api/admin/invitations/[id] — Override tier / reset AI count
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { adminService } from '@/modules/admin/server/service';
import { ValidationError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }
  const { id } = await params;
  // Return from the broader invitations list filtered — sufficient for admin use
  const data = await adminService.getInvitations(id);
  const inv = data.find((i) => i.id === id);
  if (!inv) {
    return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: inv });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const data = await adminService.updateInvitationTier(
      id,
      body,
      session.user.email ?? 'unknown'
    );
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to update invitation';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

