import { NextRequest, NextResponse } from "next/server";
import { TenderService, TenderNotFoundError } from "@/modules/tender/tender.service";
import { AIService } from "@/modules/ai/ai.service";
import { ApiResponse, ErrorCode } from "@/types/api";
import { z } from "zod";

const QuestionSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters").max(500, "Question too long"),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tenderId } = await context.params;
    const body = await request.json();

    const parseResult = QuestionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: parseResult.error.issues[0]?.message || "Invalid question input",
          },
        },
        { status: 400 }
      );
    }

    const tender = await TenderService.getTenderDetails(tenderId);

    const qaResult = await AIService.askTenderQuestion(
      {
        referenceNumber: tender.referenceNumber,
        title: tender.title,
        category: tender.category,
        organization: tender.organization,
        description: tender.description,
        requirements: tender.requirements.map((r) => ({
          type: r.type,
          title: r.title,
          description: r.description,
          isMandatory: r.isMandatory,
        })),
      },
      parseResult.data.question
    );

    const response: ApiResponse<typeof qaResult> = {
      success: true,
      data: qaResult,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof TenderNotFoundError) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.NOT_FOUND, message: error.message } },
        { status: 404 }
      );
    }

    console.error("Error in POST /api/tenders/[id]/qa:", error);
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: "Failed to answer tender question." } },
      { status: 500 }
    );
  }
}
