import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env manually
const envPath = resolve(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) return;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
  if (!process.env[key]) process.env[key] = val;
});

const TARGET_EMAIL = 'zerreff.io@gmail.com';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Check if role column exists
  const colCheck = await prisma.$queryRawUnsafe(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'User' AND column_name = 'role'
    LIMIT 1;
  `);

  const hasRoleColumn = Array.isArray(colCheck) && colCheck.length > 0;
  console.log(`ℹ️  Kolom 'role' di database: ${hasRoleColumn ? 'ADA' : 'BELUM ADA'}`);

  if (!hasRoleColumn) {
    console.log("⚙️  Menambahkan kolom 'role' ke tabel User...");
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
          CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
        END IF;
      END $$;
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'USER';
    `);
    console.log("✅ Kolom 'role' berhasil ditambahkan.");
  }

  // Check user exists
  const userRows = await prisma.$queryRawUnsafe(
    `SELECT id, name, email, role FROM "User" WHERE email = $1 LIMIT 1;`,
    TARGET_EMAIL
  );

  if (!Array.isArray(userRows) || userRows.length === 0) {
    console.error(`❌ User dengan email "${TARGET_EMAIL}" tidak ditemukan.`);
    process.exit(1);
  }

  const user = userRows[0];
  console.log(`✅ User ditemukan: ${user.name} (${user.email}) — role saat ini: ${user.role}`);

  if (user.role === 'ADMIN') {
    console.log('ℹ️  User sudah menjadi ADMIN, tidak ada perubahan.');
    return;
  }

  await prisma.$executeRawUnsafe(
    `UPDATE "User" SET role = 'ADMIN' WHERE email = $1;`,
    TARGET_EMAIL
  );

  console.log(`🎉 Berhasil! "${TARGET_EMAIL}" sekarang menjadi ADMIN.`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
