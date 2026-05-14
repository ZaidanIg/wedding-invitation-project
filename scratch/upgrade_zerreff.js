const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'zerreff.io@gmail.com';
  
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        accountType: 'B2B_ALL_TIME'
      }
    });
    
    console.log(`Success! User ${email} has been upgraded to B2B_ALL_TIME.`);
    console.log('User data:', user);
  } catch (error) {
    console.error(`Error upgrading user ${email}:`, error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
