"use server";

import { leadService } from "@/modules/leads/server/service";
import { z } from "zod";

export async function submitLead(payload: unknown) {
  try {
    const lead = await leadService.createLead(payload as any);
    return { success: true, data: lead };
  } catch (error) {
    console.error("Lead submission error:", error);
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: "Validation failed", 
        error: (error as any).errors[0].message 
      };
    }
    return { success: false, message: "Internal server error" };
  }
}
