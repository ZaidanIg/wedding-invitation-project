"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

const createProjectSchema = z.object({
  brideName: z.string().min(1, "Bride name is required"),
  groomName: z.string().min(1, "Groom name is required"),
  eventDate: z.string().min(1, "Event date is required"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9]+$/, "Username must be lowercase alphanumeric only"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function createAgencyProject(payload: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.accountType === "B2C_FREE") {
      return { success: false, message: "Unauthorized" };
    }

    const validated = createProjectSchema.safeParse(payload);
    if (!validated.success) {
      return { 
        success: false, 
        message: "Validation failed", 
        error: (validated.error as any).errors[0].message 
      };
    }

    const { brideName, groomName, eventDate, username, password } = validated.data;

    // Check if username already exists
    const existingUsername = await prisma.clientAccount.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return { success: false, message: "Username is already taken" };
    }

    // Get or create Agency for this user
    let agency = await prisma.agency.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!agency) {
      agency = await prisma.agency.create({
        data: {
          name: "My Agency",
          ownerId: session.user.id,
        },
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const projectName = `${brideName} & ${groomName} (${new Date(eventDate).getFullYear()})`;

    // Execute Transaction
    const project = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name: projectName,
          agencyId: agency.id,
          status: "DRAFT",
          clientAccounts: {
            create: {
              username,
              passwordHash,
            },
          },
        },
      });

      return newProject;
    });

    return { success: true, data: { id: project.id } };

  } catch (error) {
    console.error("Create Project Error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, message: "Username is already taken" };
      }
    }
    return { success: false, message: "Internal server error" };
  }
}

export async function getActiveAgencyProjects() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "AGENCY") {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const projects = await prisma.project.findMany({
      where: {
        status: {
          not: "COMPLETED",
        },
        agency: {
          ownerId: session.user.id,
        },
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: projects };
  } catch (error) {
    console.error("Get Active Agency Projects Error:", error);
    return { success: false, message: "Internal server error", data: [] };
  }
}
