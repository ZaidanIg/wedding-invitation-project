import { prisma } from "@/lib/prisma";

const SYSTEM_AGENCY_NAME = "Sahinaja Direct";

export async function getSystemAgencyId(): Promise<string> {
  const existing = await prisma.agency.findFirst({
    where: { name: SYSTEM_AGENCY_NAME },
  });

  if (existing) {
    return existing.id;
  }

  // Create a system user to own the agency if it doesn't exist
  let systemUser = await prisma.user.findUnique({
    where: { email: "system@sahinaja.com" },
  });

  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        name: "System Admin",
        email: "system@sahinaja.com",
        password: "NO_LOGIN_ALLOWED",
        accountType: "B2B_ALL_TIME",
      },
    });
  }

  const newAgency = await prisma.agency.create({
    data: {
      name: SYSTEM_AGENCY_NAME,
      ownerId: systemUser.id,
    },
  });

  return newAgency.id;
}
