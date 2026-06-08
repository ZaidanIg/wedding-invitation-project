import { NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { utapi } from '@/lib/utapi';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2';

export const maxDuration = 60; // Max execution time (Vercel limits)

function extractFileKey(url: string | null | undefined): string | null {
  if (!url) return null;
  // Match standard uploadthing URLs: https://utfs.io/f/key or https://*.ufs.sh/f/key
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('utfs.io') || parsed.hostname.includes('ufs.sh')) {
      const parts = parsed.pathname.split('/');
      return parts[parts.length - 1]; // Return the last segment (the key)
    }
  } catch {
    return null; // Invalid URL
  }
  return null;
}

function extractR2Key(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const r2UrlStr = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (r2UrlStr) {
      const r2Domain = new URL(r2UrlStr).hostname;
      if (parsed.hostname === r2Domain) {
        // R2 key is the full path without the leading slash (e.g. uploads/userid/filename.jpg)
        return decodeURIComponent(parsed.pathname.substring(1));
      }
    }
  } catch {
    return null;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    // 1. Verify Authorization Header
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Find Expired Invitations with Media
    // v1.2: photoUrls normalized to InvitationPhoto table; query via photos relation
    const currentDate = new Date();
    const expiredInvitations = await prisma.invitation.findMany({
      where: {
        expiresAt: { lt: currentDate },
        OR: [
          { headerPhotoUrl: { not: null } },
          { groomPhotoUrl: { not: null } },
          { bridePhotoUrl: { not: null } },
          { musicUrl: { not: null } },
          { photos: { some: {} } },   // v1.2: check InvitationPhoto relation
        ]
      },
      select: {
        id: true,
        headerPhotoUrl: true,
        groomPhotoUrl: true,
        bridePhotoUrl: true,
        musicUrl: true,
        photos: { select: { id: true, url: true } },  // v1.2: normalized photos
      }
    });

    if (expiredInvitations.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No expired invitations with media found.',
        processedCount: 0 
      });
    }

    let totalDeletedFiles = 0;
    const processPromises = expiredInvitations.map(async (invitation) => {
      // Collect all keys from role-based photos + gallery photos
      const allUrls = [
        invitation.headerPhotoUrl,
        invitation.groomPhotoUrl,
        invitation.bridePhotoUrl,
        invitation.musicUrl,
        ...invitation.photos.map((p) => p.url),  // v1.2: from InvitationPhoto
      ];

      // 1. Delete from UploadThing (legacy)
      const fileKeys = allUrls
        .map(extractFileKey)
        .filter((key): key is string => key !== null);

      if (fileKeys.length > 0) {
        await utapi.deleteFiles(fileKeys);
        totalDeletedFiles += fileKeys.length;
      }

      // 2. Delete from Cloudflare R2
      const r2Keys = allUrls
        .map(extractR2Key)
        .filter((key): key is string => key !== null);

      if (r2Keys.length > 0 && R2_BUCKET_NAME) {
        try {
          const deleteParams = {
            Bucket: R2_BUCKET_NAME,
            Delete: {
              Objects: r2Keys.map((key) => ({ Key: key })),
            },
          };
          await r2Client.send(new DeleteObjectsCommand(deleteParams));
          totalDeletedFiles += r2Keys.length;
        } catch (r2Err) {
          console.error('[Cleanup] Failed to delete R2 objects:', r2Err);
        }
      }

      // v1.2: Clear media atomically (role photos + delete InvitationPhoto records)
      await prisma.$transaction([
        prisma.invitation.update({
          where: { id: invitation.id },
          data: {
            headerPhotoUrl: null,
            groomPhotoUrl: null,
            bridePhotoUrl: null,
            musicUrl: null,
          }
        }),
        prisma.invitationPhoto.deleteMany({
          where: { invitationId: invitation.id },
        }),
      ]);
    });

    // Run updates concurrently
    await Promise.allSettled(processPromises);

    return NextResponse.json({ 
      success: true, 
      message: 'Cleanup completed successfully.',
      processedCount: expiredInvitations.length,
      deletedFiles: totalDeletedFiles
    });

  } catch (error) {
    console.error('[CRON Cleanup Error]:', error);
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
