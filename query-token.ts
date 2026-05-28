require('dotenv').config();
const { prisma } = require('./src/lib/prisma');

async function main() {
  const token = 'ee17b4e9-4b96-49e7-899f-d70f03831452';
  const tx = await prisma.transaction.findFirst({
    where: {
      paymentUrl: {
        contains: token
      }
    }
  });
  console.dir(tx, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
