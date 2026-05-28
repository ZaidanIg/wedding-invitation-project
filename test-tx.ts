import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const txs = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { invitation: true }
  });
  console.log(JSON.stringify(txs, null, 2));
}

main().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});
