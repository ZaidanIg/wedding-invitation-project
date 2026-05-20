import { NextResponse } from "next/server";
import { checkinService } from "@/modules/checkin/server/service";
import { NotFoundError, ConflictError } from "@/modules/checkin/server/errors";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

class FeatureLockedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FeatureLockedError";
  }
}

const checkinRequestSchema = z.object({
  guestId: z.string().min(1, "Guest ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  actualAttendees: z.number().int().min(1, "At least 1 attendee is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = checkinRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        error: {
          code: "VALIDATION_ERROR",
          details: parsed.error.issues,
        }
      }, { status: 400 });
    }

    const { projectId } = parsed.data;

    // Feature gate: verify QR Scanner is unlocked for this project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { hasQrScanner: true },
    });

    if (!project) {
      return NextResponse.json({
        success: false,
        message: "Project not found",
        error: { code: "NOT_FOUND" }
      }, { status: 404 });
    }

    if (!project.hasQrScanner) {
      return NextResponse.json({
        success: false,
        error: "FEATURE_LOCKED",
        message: "Fitur D-Day QR Scanner belum diaktifkan untuk proyek ini.",
      }, { status: 403 });
    }

    const guest = await checkinService.checkinGuest(parsed.data);

    return NextResponse.json({
      success: true,
      message: "Check-in successful",
      data: guest
    }, { status: 200 });

  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        error: { code: "NOT_FOUND" }
      }, { status: 404 });
    }

    if (error instanceof ConflictError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        error: { code: "CONFLICT" }
      }, { status: 409 });
    }

    console.error("Check-in API error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_SERVER_ERROR" }
    }, { status: 500 });
  }
}
