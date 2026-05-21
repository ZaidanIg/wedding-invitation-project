import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env
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

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run(sql, label) {
  try {
    await prisma.$executeRawUnsafe(sql);
    console.log(`✅ ${label}`);
  } catch (e) {
    if (e.message?.includes('already exists') || e.message?.includes('duplicate')) {
      console.log(`ℹ️  ${label} — already exists, skipped`);
    } else {
      throw e;
    }
  }
}

async function main() {
  console.log('\n🔧 Running B2C SaaS schema migration...\n');

  // 1. Create Tier enum if it doesn't exist
  const tierExists = await prisma.$queryRawUnsafe(
    `SELECT 1 FROM pg_type WHERE typname = 'Tier' LIMIT 1;`
  );

  if (!Array.isArray(tierExists) || tierExists.length === 0) {
    console.log('⚙️  Creating "Tier" enum...');
    await prisma.$executeRawUnsafe(
      `CREATE TYPE "Tier" AS ENUM ('DRAFT', 'BASIC', 'PREMIUM', 'ULTIMATE');`
    );
    console.log('✅ "Tier" enum created with DRAFT, BASIC, PREMIUM, ULTIMATE');
  } else {
    // Enum exists — ensure DRAFT is in it
    const hasDraft = await prisma.$queryRawUnsafe(
      `SELECT 1 FROM pg_enum WHERE enumlabel = 'DRAFT' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'Tier') LIMIT 1;`
    );
    if (!Array.isArray(hasDraft) || hasDraft.length === 0) {
      console.log('⚙️  Adding DRAFT to existing "Tier" enum...');
      await prisma.$executeRawUnsafe(`ALTER TYPE "Tier" ADD VALUE IF NOT EXISTS 'DRAFT' BEFORE 'BASIC';`);
      console.log('✅ DRAFT added to "Tier" enum');
    } else {
      console.log('ℹ️  "Tier" enum already has DRAFT — skipped');
    }
  }

  // 2. Add tier column to Invitation if missing
  const tierCol = await prisma.$queryRawUnsafe(
    `SELECT 1 FROM information_schema.columns WHERE table_name = 'Invitation' AND column_name = 'tier' LIMIT 1;`
  );
  if (!Array.isArray(tierCol) || tierCol.length === 0) {
    console.log('⚙️  Adding tier column to Invitation...');
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "tier" "Tier" NOT NULL DEFAULT 'DRAFT';`
    );
    console.log('✅ tier column added (default: DRAFT)');
  } else {
    console.log('ℹ️  tier column already exists on Invitation — skipped');
    // Update DEFAULT to DRAFT if it was BASIC before
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Invitation" ALTER COLUMN "tier" SET DEFAULT 'DRAFT';`
    );
    console.log('✅ tier column default updated to DRAFT');
  }

  // 3. Add aiRegenCount column if missing
  const regenCol = await prisma.$queryRawUnsafe(
    `SELECT 1 FROM information_schema.columns WHERE table_name = 'Invitation' AND column_name = 'aiRegenCount' LIMIT 1;`
  );
  if (!Array.isArray(regenCol) || regenCol.length === 0) {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "aiRegenCount" INTEGER NOT NULL DEFAULT 0;`
    );
    console.log('✅ aiRegenCount column added');
  } else {
    console.log('ℹ️  aiRegenCount column already exists — skipped');
  }

  // 4. Add videoUrl column if missing
  const videoCol = await prisma.$queryRawUnsafe(
    `SELECT 1 FROM information_schema.columns WHERE table_name = 'Invitation' AND column_name = 'videoUrl' LIMIT 1;`
  );
  if (!Array.isArray(videoCol) || videoCol.length === 0) {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;`
    );
    console.log('✅ videoUrl column added');
  } else {
    console.log('ℹ️  videoUrl column already exists — skipped');
  }

  // 5. Add isPaid column if missing
  const isPaidCol = await prisma.$queryRawUnsafe(
    `SELECT 1 FROM information_schema.columns WHERE table_name = 'Invitation' AND column_name = 'isPaid' LIMIT 1;`
  );
  if (!Array.isArray(isPaidCol) || isPaidCol.length === 0) {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "isPaid" BOOLEAN NOT NULL DEFAULT false;`
    );
    console.log('✅ isPaid column added');
  } else {
    console.log('ℹ️  isPaid column already exists — skipped');
  }

  // 6. Verify final counts
  const counts = await prisma.$queryRawUnsafe(
    `SELECT tier, COUNT(*) FROM "Invitation" GROUP BY tier ORDER BY tier;`
  );
  console.log('\n📊 Invitation tier distribution:');
  if (Array.isArray(counts) && counts.length > 0) {
    counts.forEach((r) => console.log(`   ${r.tier}: ${r.count}`));
  } else {
    console.log('   (no invitations yet)');
  }

  console.log('\n🎉 Migration complete!\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Migration failed:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
