import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCachedClientAccount } from "@/lib/client-auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "CLIENT") {
      return errorResponse("Unauthorized", 401, "UNAUTHORIZED");
    }

    // Fetch the ClientAccount directly from the database using user ID to prevent session tampering
    const clientAccount = await getCachedClientAccount(session.user.id);

    if (!clientAccount) {
      return errorResponse("Unauthorized", 401, "UNAUTHORIZED");
    }

    const projectId = clientAccount.projectId;

    const invitation = await prisma.invitation.findFirst({
      where: { projectId },
      include: {
        guests: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!invitation) {
      return successResponse({
        invitation: null,
        stats: {
          totalGuests: 0,
          attending: 0,
          notAttending: 0,
          pending: 0,
          totalAttendees: 0,
          checkedIn: 0,
          viewCount: 0,
        },
        guests: [],
      });
    }

    const guests = invitation.guests;

    const stats = {
      totalGuests: guests.length,
      attending: guests.filter((g) => g.rsvpStatus === "ATTENDING").length,
      notAttending: guests.filter((g) => g.rsvpStatus === "NOT_ATTENDING").length,
      pending: guests.filter((g) => g.rsvpStatus === "PENDING").length,
      totalAttendees: guests
        .filter((g) => g.rsvpStatus === "ATTENDING")
        .reduce((sum, g) => sum + g.attendees, 0),
      checkedIn: guests.filter((g) => g.checkedIn).length,
      viewCount: invitation.viewCount,
    };

    // Strip the guests from the invitation object to avoid duplication
    const { guests: _, ...invitationData } = invitation;

    return successResponse({
      invitation: {
        ...invitationData,
        eventDate: invitation.eventDate.toISOString(),
      },
      stats,
      guests: guests.map((g) => ({
        id: g.id,
        name: g.name,
        email: g.email,
        phone: g.phone,
        rsvpStatus: g.rsvpStatus,
        message: g.message,
        attendees: g.attendees,
        checkedIn: g.checkedIn,
        createdAt: g.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Client Dashboard API Error:", error);
    return errorResponse("Internal server error", 500, "INTERNAL_ERROR");
  }
}
