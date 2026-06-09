import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id && session?.user?.role !== 'ADMIN') {
      // Allow unauthenticated checking if we want public job tracking, 
      // but usually this should be protected.
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { id } = await params;
    const job = await prisma.backgroundJob.findUnique({
      where: { jobId: id },
    });

    if (!job) {
      return errorResponse('Job not found', 404, 'NOT_FOUND');
    }

    return successResponse(job, 'Job status retrieved successfully');
  } catch (error) {
    console.error('[API_V2_JOBS_GET]', error);
    return errorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
