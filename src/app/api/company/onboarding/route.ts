import { NextResponse } from "next/server";
import { AuthService, UnauthorizedError } from "@/modules/auth/auth.service";
import { CompanyService, CompanyValidationError } from "@/modules/company/company.service";
import { ApiResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    const { user } = await AuthService.getSession();
    const body = await req.json();

    const company = await CompanyService.onboardCompany(user.id, body);

    const response: ApiResponse<typeof company> = {
      success: true,
      data: company,
      message: "Company onboarded successfully",
    };

    return NextResponse.json(response, { status: 201 });
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

    console.error("Error in company onboarding route:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to onboard company",
        },
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
