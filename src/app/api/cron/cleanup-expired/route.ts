import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { utapi } from '@/lib/utapi';

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
  } catch (e) {
    return null; // Invalid URL
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
    const currentDate = new Date();
    const expiredInvitations = await prisma.invitation.findMany({
      where: {
        expiresAt: {
          lt: currentDate,
        },
        OR: [
          { headerPhotoUrl: { not: null } },
          { groomPhotoUrl: { not: null } },
          { bridePhotoUrl: { not: null } },
          { musicUrl: { not: null } },
          { photoUrls: { isEmpty: false } },
        ]
      },
      select: {
        id: true,
        headerPhotoUrl: true,
        groomPhotoUrl: true,
        bridePhotoUrl: true,
        musicUrl: true,
        photoUrls: true,
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
      // Collect all keys
      const allUrls = [
        invitation.headerPhotoUrl,
        invitation.groomPhotoUrl,
        invitation.bridePhotoUrl,
        invitation.musicUrl,
        ...invitation.photoUrls
      ];

      const fileKeys = allUrls
        .map(extractFileKey)
        .filter((key): key is string => key !== null);

      if (fileKeys.length > 0) {
        // Delete from UploadThing
        await utapi.deleteFiles(fileKeys);
        totalDeletedFiles += fileKeys.length;
      }

      // Update Database to clear media
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          headerPhotoUrl: null,
          groomPhotoUrl: null,
          bridePhotoUrl: null,
          musicUrl: null,
          photoUrls: [],
        }
      });
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
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
