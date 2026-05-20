import { prisma } from "@/lib/prisma";
import { NotFoundError, ConflictError } from "./errors";

export const checkinRepository = {
  async processCheckin(guestId: string, projectId: string, actualAttendees: number) {
    return prisma.$transaction(async (tx) => {
      const guest = await tx.guest.findUnique({
        where: { id: guestId }
      });

      if (!guest || guest.projectId !== projectId) {
        throw new NotFoundError("Guest not found");
      }

      if (guest.checkedIn) {
        throw new ConflictError("Guest already checked in");
      }

      return tx.guest.update({
        where: { id: guestId },
        data: {
          checkedIn: true,
          attendees: actualAttendees,
        }
      });
    });
  }
};
