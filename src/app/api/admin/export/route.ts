import { auth } from '@/lib/auth';
import { adminService } from '@/modules/admin/server/service';
import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return errorResponse('Forbidden', 403, 'FORBIDDEN');
    }

    const buffer = await adminService.generateExportExcel();

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Laporan_Sahinaja_${timestamp}.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
