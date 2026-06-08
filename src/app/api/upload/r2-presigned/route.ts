import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { filename, fileType } = await request.json();
    if (!filename || !fileType) {
      return errorResponse('Filename and fileType are required', 400, 'BAD_REQUEST');
    }

    if (!R2_BUCKET_NAME) {
      return errorResponse('Storage bucket is not configured', 500, 'INTERNAL_SERVER_ERROR');
    }

    // Generate unique folder structure per user
    const fileExtension = filename.split('.').pop() || 'bin';
    const cleanExtension = fileExtension.replace(/[^a-zA-Z0-9]/g, '');
    const uniqueKey = `uploads/${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${cleanExtension}`;

    // PutObject Command configuration
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: fileType,
    });

    // Presigned URL expires in 10 minutes (600 seconds)
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 600 });
    
    // File public URL mapping
    const fileUrl = `${R2_PUBLIC_URL}/${uniqueKey}`;

    return successResponse({
      uploadUrl,
      fileUrl,
      key: uniqueKey,
    }, 'Presigned URL generated successfully');
  } catch (error: any) {
    console.error('Error generating presigned R2 URL:', error);
    return errorResponse(error.message || 'Internal Server Error', 500, 'INTERNAL_SERVER_ERROR');
  }
}
