import { NextRequest, NextResponse } from "next/server";
import { AuthService, UnauthorizedError, CompanyRequiredError } from "@/modules/auth/auth.service";
import { TenderService, TenderNotFoundError } from "@/modules/tender/tender.service";
import { AIService } from "@/modules/ai/ai.service";
import { ApiResponse, ErrorCode } from "@/types/api";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { company } = await AuthService.getAuthCompany(request.headers);
    const { id: tenderId } = await context.params;

    const tender = await TenderService.getTenderDetails(tenderId);

    const eligibilityResult = await AIService.analyzeEligibility(
      {
        name: company.name,
        annualTurnover: company.annualTurnover ? Number(company.annualTurnover) : null,
        yearsOfExperience: company.yearsOfExperience,
        certifications: company.certifications,
        areasOfOperation: company.areasOfOperation,
        industry: company.industry,
      },
      {
        title: tender.title,
        category: tender.category,
        estimatedValue: tender.estimatedValue ? Number(tender.estimatedValue) : null,
        requirements: tender.requirements.map((r) => ({
          type: r.type,
          title: r.title,
          description: r.description,
          isMandatory: r.isMandatory,
        })),
      }
    );

    const response: ApiResponse<typeof eligibilityResult> = {
      success: true,
      data: eligibilityResult,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.UNAUTHORIZED, message: error.message } }, { status: 401 });
    }
    if (error instanceof CompanyRequiredError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.FORBIDDEN, message: error.message } }, { status: 403 });
    }
    if (error instanceof TenderNotFoundError) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.NOT_FOUND, message: error.message } }, { status: 404 });
    }

    console.error("Error in POST /api/tenders/[id]/eligibility:", error);
    return NextResponse.json({ success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: "Failed to evaluate company eligibility." } }, { status: 500 });
  }
}
