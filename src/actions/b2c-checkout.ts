"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getSystemAgencyId } from "@/lib/system-agency";
import { Prisma } from "@prisma/client";

const b2cCheckoutSchema = z.object({
  brideName: z.string().min(1, "Bride name is required"),
  groomName: z.string().min(1, "Groom name is required"),
  eventDate: z.string().min(1, "Event date is required"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9]+$/, "Username must be lowercase alphanumeric only"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerB2CDiy(payload: unknown) {
  try {
    const validated = b2cCheckoutSchema.safeParse(payload);
    if (!validated.success) {
      return { 
        success: false, 
        message: "Validation failed", 
        error: (validated.error as any).errors[0].message 
      };
    }

    const { brideName, groomName, eventDate, username, password } = validated.data;

    const existingUsername = await prisma.clientAccount.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return { success: false, message: "Username is already taken" };
    }

    const systemAgencyId = await getSystemAgencyId();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const projectName = `${brideName} & ${groomName} (DIY B2C)`;

    await prisma.$transaction(async (tx) => {
      await tx.project.create({
        data: {
          name: projectName,
          agencyId: systemAgencyId,
          status: "DRAFT",
          clientAccounts: {
            create: {
              username,
              passwordHash,
            },
          },
        },
      });
    });

    return { success: true, redirect: '/client/login' };

  } catch (error) {
    console.error("B2C Checkout Error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, message: "Username is already taken" };
      }
    }
    return { success: false, message: "Internal server error" };
  }
}
