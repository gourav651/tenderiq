import { NextRequest, NextResponse } from "next/server";
import { AuthService, UnauthorizedError, CompanyRequiredError } from "@/modules/auth/auth.service";
import { ApplicationService, ApplicationValidationError, ApplicationConflictError } from "@/modules/application/application.service";
import { ApiResponse, ErrorCode } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const { company } = await AuthService.getAuthCompany(request.headers);

    const applications = await ApplicationService.getCompanyApplications(company.id);

    const response: ApiResponse<typeof applications> = {
      success: true,
      data: applications,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.UNAUTHORIZED, message: error.message } }, { status: 401 });
    }
    if (error instanceof CompanyRequiredError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.FORBIDDEN, message: error.message } }, { status: 403 });
    }

    console.error("Error in GET /api/applications:", error);
    return NextResponse.json({ success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: "Failed to fetch applications." } }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, company } = await AuthService.getAuthCompany(request.headers);
    const body = await request.json();

    const application = await ApplicationService.createApplication(company.id, user.id, body);

    const response: ApiResponse<typeof application> = {
      success: true,
      data: application,
      message: "Application tracked successfully.",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.UNAUTHORIZED, message: error.message } }, { status: 401 });
    }
    if (error instanceof CompanyRequiredError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.FORBIDDEN, message: error.message } }, { status: 403 });
    }
    if (error instanceof ApplicationValidationError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.VALIDATION_ERROR, message: error.message } }, { status: 400 });
    }
    if (error instanceof ApplicationConflictError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.CONFLICT, message: error.message } }, { status: 409 });
    }

    console.error("Error in POST /api/applications:", error);
    return NextResponse.json({ success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: "Failed to create application entry." } }, { status: 500 });
  }
}
