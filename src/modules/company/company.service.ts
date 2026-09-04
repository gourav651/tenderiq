import { CompanyRepository } from "./company.repository";
import { CreateCompanySchema, UpdateCompanySchema, CreateCompanyInput, UpdateCompanyInput } from "./company.schema";
import { Company } from "@/generated/prisma/client";

export class CompanyNotFoundError extends Error {
  constructor(message = "Company not found") {
    super(message);
    this.name = "CompanyNotFoundError";
  }
}

export class CompanyValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompanyValidationError";
  }
}

export class CompanyService {
  /**
   * Onboards a new company and links the creating user to it.
   */
  static async onboardCompany(userId: string, input: CreateCompanyInput): Promise<Company> {
    const parseResult = CreateCompanySchema.safeParse(input);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
      throw new CompanyValidationError(errorMsg);
    }

    const validatedData = parseResult.data;

    // Create company
    const company = await CompanyRepository.create(validatedData);

    // Link current user to newly created company
    await CompanyRepository.linkUserToCompany(userId, company.id);

    return company;
  }

  /**
   * Retrieves details for a specific company by ID.
   */
  static async getCompanyDetails(companyId: string): Promise<Company> {
    const company = await CompanyRepository.findById(companyId);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    return company;
  }

  /**
   * Updates profile data for a company.
   */
  static async updateCompanyProfile(companyId: string, input: UpdateCompanyInput): Promise<Company> {
    const parseResult = UpdateCompanySchema.safeParse(input);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
      throw new CompanyValidationError(errorMsg);
    }

    await this.getCompanyDetails(companyId);

    return CompanyRepository.update(companyId, parseResult.data);
  }
}
