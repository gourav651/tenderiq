import { NextRequest, NextResponse } from "next/server";
import { TenderService, TenderNotFoundError, TenderValidationError } from "@/modules/tender/tender.service";
import { ApiResponse, ErrorCode } from "@/types/api";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const tender = await TenderService.getTenderDetails(id);

    const response: ApiResponse<typeof tender> = {
      success: true,
      data: tender,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof TenderValidationError) {
      const errorResponse: ApiResponse<never> = {
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: error.message,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (error instanceof TenderNotFoundError) {
      const notFoundResponse: ApiResponse<never> = {
        success: false,
        error: {
          code: ErrorCode.NOT_FOUND,
          message: "Tender not found.",
        },
      };
      return NextResponse.json(notFoundResponse, { status: 404 });
    }

    console.error("Error in GET /api/tenders/[id]:", error);
    const internalError: ApiResponse<never> = {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "An internal server error occurred while retrieving tender details.",
      },
    };
    return NextResponse.json(internalError, { status: 500 });
  }
}
