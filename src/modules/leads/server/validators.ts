import { z } from "zod";

export const createLeadSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format"),
  eventDate: z.string().or(z.date()).transform((val) => new Date(val)),
  budget: z.number().min(0, "Budget cannot be negative"),
  guestCount: z.number().int().min(1, "Guest count must be at least 1"),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
