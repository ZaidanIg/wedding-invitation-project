import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Checking Invitation ---');
  const invitation = await prisma.invitation.findUnique({
    where: { slug: 'cmpfifsip0001kqwt234s89qb' },
    include: { guests: true }
  });
  console.log('Invitation:', invitation ? {
    id: invitation.id,
    groomName: invitation.groomName,
    brideName: invitation.brideName,
    slug: invitation.slug,
    userId: invitation.userId,
    tier: invitation.tier,
    guestCount: invitation.guests.length
  } : 'Not found');

  if (invitation) {
    console.log('\n--- Checking Guests ---');
    invitation.guests.forEach(g => {
      console.log(`Guest: ID=${g.id}, Name=${g.name}, Phone=${g.phone}, isVip=${g.isVip}, checkedIn=${g.checkedIn}, rsvpStatus=${g.rsvpStatus}`);
    });

    console.log('\n--- Checking Users ---');
    const user = await prisma.user.findUnique({
      where: { id: invitation.userId }
    });
    console.log('Owner User:', user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    } : 'Not found');

    const allUsers = await prisma.user.findMany();
    console.log('\nAll Users in DB:');
    allUsers.forEach(u => {
      console.log(`User: ID=${u.id}, Name=${u.name}, Email=${u.email}, Role=${u.role}`);
    });
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
