import { auth } from '@/lib/auth';
import { adminService } from '@/modules/admin/server/service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const buffer = await adminService.generateExportExcel();

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Laporan_Sahinaja_${timestamp}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('[Admin Export Error]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
