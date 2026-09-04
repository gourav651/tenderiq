import { NextRequest, NextResponse } from "next/server";
import { AuthService, UnauthorizedError, CompanyRequiredError, ForbiddenError } from "@/modules/auth/auth.service";
import { ApplicationService, ApplicationNotFoundError, ApplicationValidationError } from "@/modules/application/application.service";
import { ApiResponse, ErrorCode } from "@/types/api";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { company } = await AuthService.getAuthCompany(request.headers);
    const { id } = await context.params;
    const body = await request.json();

    const updated = await ApplicationService.updateApplication(company.id, id, body);

    const response: ApiResponse<typeof updated> = {
      success: true,
      data: updated,
      message: "Application status updated.",
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.UNAUTHORIZED, message: error.message } }, { status: 401 });
    }
    if (error instanceof CompanyRequiredError || error instanceof ForbiddenError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.FORBIDDEN, message: error.message } }, { status: 403 });
    }
    if (error instanceof ApplicationNotFoundError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.NOT_FOUND, message: error.message } }, { status: 404 });
    }
    if (error instanceof ApplicationValidationError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.VALIDATION_ERROR, message: error.message } }, { status: 400 });
    }

    console.error("Error in PATCH /api/applications/[id]:", error);
    return NextResponse.json({ success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: "Failed to update application." } }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { company } = await AuthService.getAuthCompany(request.headers);
    const { id } = await context.params;

    const deleted = await ApplicationService.deleteApplication(company.id, id);

    const response: ApiResponse<typeof deleted> = {
      success: true,
      data: deleted,
      message: "Application deleted successfully.",
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.UNAUTHORIZED, message: error.message } }, { status: 401 });
    }
    if (error instanceof CompanyRequiredError || error instanceof ForbiddenError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.FORBIDDEN, message: error.message } }, { status: 403 });
    }
    if (error instanceof ApplicationNotFoundError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.NOT_FOUND, message: error.message } }, { status: 404 });
    }

    console.error("Error in DELETE /api/applications/[id]:", error);
    return NextResponse.json({ success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: "Failed to delete application." } }, { status: 500 });
  }
}
