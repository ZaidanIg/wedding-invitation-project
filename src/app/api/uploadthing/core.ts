import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/lib/auth';

const f = createUploadthing();

export const ourFileRouter = {
  weddingPhotos: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 8,
    },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error('Unauthorized');
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('file url:', file.ufsUrl);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
