import { NextResponse } from "next/server";
import { AuthService, UnauthorizedError, CompanyRequiredError, ForbiddenError } from "@/modules/auth/auth.service";
import { CompanyService, CompanyValidationError, CompanyNotFoundError } from "@/modules/company/company.service";
import { ApiResponse } from "@/types/api";

export async function GET() {
  try {
    const { company } = await AuthService.getAuthCompany();
    const companyDetails = await CompanyService.getCompanyDetails(company.id);

    const response: ApiResponse<typeof companyDetails> = {
      success: true,
      data: companyDetails,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: error.message,
          },
        } as ApiResponse<null>,
        { status: 401 }
      );
    }

    if (error instanceof CompanyRequiredError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "COMPANY_REQUIRED",
            message: error.message,
          },
        } as ApiResponse<null>,
        { status: 403 }
      );
    }

    if (error instanceof CompanyNotFoundError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: error.message,
          },
        } as ApiResponse<null>,
        { status: 44 }
      );
    }

    console.error("Error in GET /api/company/me:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve company details",
        },
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { company } = await AuthService.getAuthCompany();
    const body = await req.json();

    const updatedCompany = await CompanyService.updateCompanyProfile(company.id, body);

    const response: ApiResponse<typeof updatedCompany> = {
      success: true,
      data: updatedCompany,
      message: "Company profile updated successfully",
    };

    return NextResponse.json(response);
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: error.message,
          },
        } as ApiResponse<null>,
        { status: 401 }
      );
    }

    if (error instanceof CompanyRequiredError || error instanceof ForbiddenError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: error.message,
          },
        } as ApiResponse<null>,
        { status: 403 }
      );
    }

    if (error instanceof CompanyValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: error.message,
          },
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    console.error("Error in PATCH /api/company/me:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update company profile",
        },
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
