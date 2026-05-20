import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const leadRepository = {
  async create(data: Prisma.LeadCreateInput) {
    return prisma.lead.create({
      data,
    });
  },
};
