import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/lib/auth';

const f = createUploadthing();

export const ourFileRouter = {
  weddingPhotos: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 30,
    },
  })
    .middleware(async ({ req }) => {
      try {
        let session = await auth();
        
        // Allow API testing in development via mock header
        if (!session && process.env.NODE_ENV === 'development' && req.headers.get('x-mock-auth') === 'true') {
          console.log("[UploadThing Middleware] Using development mock session for zaika");
          session = {
            user: {
              id: "cmpcui3er0001avwtum3heo2f",
              name: "zaika",
              email: "zaika@client.local",
              accountType: "B2C_FREE",
              role: "CLIENT",
              projectId: "cmpcui3er0001avwtum3heo2f"
            }
          } as any;
        }

        console.log("[UploadThing Middleware] Session:", JSON.stringify(session, null, 2));
        if (!session?.user) {
          console.error("[UploadThing Middleware] Missing session user!");
          throw new Error('Unauthorized');
        }
        if (session.user.role !== 'AGENCY' && session.user.role !== 'CLIENT') {
          console.error("[UploadThing Middleware] Invalid role:", session.user.role);
          throw new Error('Unauthorized role');
        }
        return { 
          userId: session.user.id,
          role: session.user.role,
          projectId: session.user.projectId || null
        };
      } catch (e) {
        console.error("[UploadThing Middleware] Error:", e);
        throw e;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('file url:', file.ufsUrl);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
