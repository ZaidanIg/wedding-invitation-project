const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const p = await prisma.promo.create({
      data: {
        code: "TEST1234",
        discountPercent: 10,
        maxGlobalUsage: 100,
        usageLimitPerUser: 1,
        usageLimitPerIp: 1,
        isActive: true,
      }
    });
    console.log("Success:", p);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
