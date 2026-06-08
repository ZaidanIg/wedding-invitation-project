import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Force clear the cache for hot-reload to pick up new models
delete (globalThis as any).prisma;

function createPrismaClient(): PrismaClient {
  let sslConfig: any = undefined;

  // Best Practice SSL verification
  if (process.env.DB_CA_CERT) {
    // Use certificate injected from Environment Variables (Netlify)
    const ca = process.env.DB_CA_CERT.includes('\\n') 
      ? process.env.DB_CA_CERT.replace(/\\n/g, '\n')
      : process.env.DB_CA_CERT;
      
    sslConfig = {
      rejectUnauthorized: true,
      ca: ca,
    };
  } else if (process.env.NODE_ENV === 'production') {
    // Fallback for local development
    try {
      const certPath = path.join(process.cwd(), 'prisma', 'ca.pem');
      if (fs.existsSync(certPath)) {
        sslConfig = {
          rejectUnauthorized: true,
          ca: fs.readFileSync(certPath).toString(),
        };
      }
    } catch (e) {
      console.warn('Local ca.pem not found for SSL connection.');
    }
  } else {
    // Force rejectUnauthorized: false in local dev to avoid TLS errors
    // especially when connecting to generic poolers (e.g., Supabase)
    sslConfig = { rejectUnauthorized: false };
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig,
    max: process.env.NODE_ENV === 'production' ? 1 : 10,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: true,
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
