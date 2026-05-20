import { leadRepository } from "./repository";
import { createLeadSchema, type CreateLeadInput } from "./validators";

export const leadService = {
  async createLead(payload: CreateLeadInput) {
    const validated = createLeadSchema.parse(payload);

    const lead = await leadRepository.create({
      clientName: validated.clientName,
      phone: validated.phone,
      eventDate: validated.eventDate,
      budget: validated.budget,
      guestCount: validated.guestCount,
      status: "NEW",
    });

    return lead;
  },
};
