// GET /api/admin/transactions — Paginated transaction list with filters
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
    const { searchParams } = new URL(req.url);
    const rawFilters = {
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 20,
      status: searchParams.get('status') ?? undefined,
      type: searchParams.get('type') ?? undefined,
      startDate: searchParams.get('startDate') ?? undefined,
      endDate: searchParams.get('endDate') ?? undefined,
    };

    const result = await adminService.getTransactions(rawFilters);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to fetch transactions';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
