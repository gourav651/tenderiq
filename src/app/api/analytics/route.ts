import { NextRequest, NextResponse } from "next/server";
import { AuthService, UnauthorizedError, CompanyRequiredError } from "@/modules/auth/auth.service";
import { AnalyticsService } from "@/modules/analytics/analytics.service";
import { ApiResponse, ErrorCode } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const { company } = await AuthService.getAuthCompany(request.headers);

    const analytics = await AnalyticsService.getCompanyAnalytics(company.id);

    const response: ApiResponse<typeof analytics> = {
      success: true,
      data: analytics,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.UNAUTHORIZED, message: error.message } },
        { status: 401 }
      );
    }
    if (error instanceof CompanyRequiredError) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.FORBIDDEN, message: error.message } },
        { status: 403 }
      );
    }

    console.error("Error in GET /api/analytics:", error);
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: "Failed to load procurement analytics." } },
      { status: 500 }
    );
  }
}
