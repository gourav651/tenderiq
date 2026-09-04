import { NextRequest, NextResponse } from "next/server";
import { TenderService, TenderValidationError } from "@/modules/tender/tender.service";
import { ApiResponse, ErrorCode } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawInput = {
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      search: searchParams.get("search") || undefined,
      aiQuery: searchParams.get("aiQuery") || undefined,
      category: searchParams.get("category") || undefined,
      state: searchParams.get("state") || undefined,
      organization: searchParams.get("organization") || undefined,
      tenderType: searchParams.get("tenderType") || undefined,
      status: searchParams.get("status") || undefined,
      minEstimatedValue: searchParams.get("minEstimatedValue") || undefined,
      maxEstimatedValue: searchParams.get("maxEstimatedValue") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
    };

    const result = await TenderService.searchTenders(rawInput);

    const response: ApiResponse<typeof result.tenders> = {
      success: true,
      data: result.tenders,
      meta: result.meta,
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

    console.error("Error in GET /api/tenders:", error);
    const internalError: ApiResponse<never> = {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "An internal server error occurred while retrieving tenders.",
      },
    };
    return NextResponse.json(internalError, { status: 500 });
  }
}
