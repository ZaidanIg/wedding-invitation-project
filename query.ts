require('dotenv').config();
const { prisma } = require('./src/lib/prisma');

async function main() {
  const txs = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { invitation: true }
  });
  console.dir(txs, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
