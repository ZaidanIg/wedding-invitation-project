import { z } from "zod";

export const checkinSchema = z.object({
  guestId: z.string().min(1, "Guest ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  actualAttendees: z.number().int().min(1, "At least 1 attendee is required"),
});

export type CheckinInput = z.infer<typeof checkinSchema>;
