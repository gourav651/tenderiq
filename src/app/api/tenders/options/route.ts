import { NextResponse } from "next/server";
import { TenderService } from "@/modules/tender/tender.service";
import { ApiResponse, ErrorCode } from "@/types/api";

export async function GET() {
  try {
    const filterOptions = await TenderService.getFilterOptions();

    const response: ApiResponse<typeof filterOptions> = {
      success: true,
      data: filterOptions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in GET /api/tenders/options:", error);
    const internalError: ApiResponse<never> = {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "Failed to fetch tender filter options.",
      },
    };
    return NextResponse.json(internalError, { status: 500 });
  }
}
