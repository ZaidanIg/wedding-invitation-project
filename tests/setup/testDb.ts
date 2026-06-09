import { prisma } from '../../src/lib/prisma';

export const testDb = {
  /**
   * Truncate all tables in the public schema of the test database.
   * This ensures a clean slate between tests.
   */
  async truncate() {
    const tablenames = await prisma.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tablenames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ');

    try {
      if (tables) {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
      }
    } catch (error) {
      console.error({ error }, 'Error truncating tables');
    }
  },

  /**
   * Disconnect prisma safely
   */
  async disconnect() {
    await prisma.$disconnect();
    // End the underlying pg pool to release Supabase connection limits during Jest tests
    const { prismaPool } = require('../../src/lib/prisma');
    if (prismaPool) {
      await prismaPool.end();
    }
  },
};
