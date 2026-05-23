// GET /api/admin/users  — List all users with stats
// PATCH /api/admin/users — Update user role
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { adminService } from '@/modules/admin/server/service';
import { ValidationError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const search = new URL(req.url).searchParams.get('search') ?? undefined;
    const data = await adminService.getUsers(search);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = await adminService.updateUserRole(body, session.user.email ?? 'unknown');
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to update user';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
