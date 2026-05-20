"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getSystemAgencyId } from "@/lib/system-agency";
import { getCachedClientAccount } from "@/lib/client-auth";

const clientInvitationSchema = z.object({
  brideName: z.string().min(1, "Bride name is required"),
  groomName: z.string().min(1, "Groom name is required"),
  eventDate: z.string().min(1, "Event date is required"),
  venueName: z.string().min(1, "Venue name is required"),
  venueAddress: z.string().min(1, "Venue address is required"),
  photoUrls: z.array(z.string()).optional().default([]),
  loveStory: z.array(z.any()).optional().default([]),
});

export async function upsertClientInvitation(payload: unknown) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'CLIENT') {
      return { success: false, message: "Unauthorized" };
    }

    // Fetch ClientAccount directly from DB to enforce absolute boundary protection
    const clientAccount = await getCachedClientAccount(session.user.id);

    if (!clientAccount) {
      return { success: false, message: "Unauthorized" };
    }

    const projectId = clientAccount.projectId;

    const validated = clientInvitationSchema.safeParse(payload);
    if (!validated.success) {
      return { 
        success: false, 
        message: "Validation failed", 
        error: (validated.error as any).errors[0].message 
      };
    }

    const { brideName, groomName, eventDate, venueName, venueAddress, photoUrls, loveStory } = validated.data;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    const systemAgencyId = await getSystemAgencyId();
    const isBasicTier = project?.agencyId === systemAgencyId;

    const existing = await prisma.invitation.findFirst({
      where: { projectId },
    });

    if (!existing) {
      return {
        success: false,
        error: 'NOT_INITIALIZED',
        message: 'Wedding Organizer Anda belum menginisialisasi draf undangan. Silakan hubungi WO Anda.'
      };
    }

    const commonData = {
      brideName,
      groomName,
      eventDate: new Date(eventDate),
      venueName,
      venueAddress,
      photoUrls,
      loveStory: loveStory as any,
    };

    const invitation = await prisma.invitation.update({
      where: { id: existing.id },
      data: {
        ...commonData,
        tier: isBasicTier ? 'BASIC' : existing.tier,
      },
    });

    return { success: true, data: { id: invitation.id } };
  } catch (error) {
    console.error("Upsert Invitation Error:", error);
    return { success: false, message: "Internal server error" };
  }
}

export async function updateProjectSetting(payload: { setting: 'isWhiteLabel' | 'hasQrScanner'; value: boolean }) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'CLIENT') {
      return { success: false, message: "Unauthorized" };
    }

    // Fetch ClientAccount directly from DB to enforce absolute boundary protection
    const clientAccount = await getCachedClientAccount(session.user.id);

    if (!clientAccount) {
      return { success: false, message: "Unauthorized" };
    }

    const projectId = clientAccount.projectId;
    const { setting, value } = payload;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { agency: true }
    });

    if (!project) {
      return { success: false, message: "Project not found" };
    }

    const isDiyProject = project.agency?.name === "Sahinaja Direct";
    if (!isDiyProject) {
      return { success: false, message: "Exclusively managed by your Wedding Organizer" };
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        [setting]: value
      }
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Update Project Setting Error:", error);
    return { success: false, message: "Internal server error" };
  }
}
