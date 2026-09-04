import { ApplicationRepository, ApplicationWithTender } from "./application.repository";
import { CreateApplicationSchema, UpdateApplicationSchema } from "./application.schema";
import { AuthService } from "../auth/auth.service";
import { Application } from "@/generated/prisma/client";

export class ApplicationNotFoundError extends Error {
  constructor(message = "Application not found") {
    super(message);
    this.name = "ApplicationNotFoundError";
  }
}

export class ApplicationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApplicationValidationError";
  }
}

export class ApplicationConflictError extends Error {
  constructor(message = "Application already exists for this tender") {
    super(message);
    this.name = "ApplicationConflictError";
  }
}

export class ApplicationService {
  /**
   * Creates or tracks a new application for a user's company.
   */
  static async createApplication(companyId: string, userId: string, rawInput: unknown): Promise<Application> {
    const parseResult = CreateApplicationSchema.safeParse(rawInput);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
      throw new ApplicationValidationError(errorMsg);
    }

    const input = parseResult.data;

    // Check if application already exists for this company & tender
    const existing = await ApplicationRepository.findByCompanyAndTender(companyId, input.tenderId);
    if (existing) {
      throw new ApplicationConflictError();
    }

    return ApplicationRepository.create(companyId, userId, input);
  }

  /**
   * Lists all tracked applications for a company.
   */
  static async getCompanyApplications(companyId: string): Promise<ApplicationWithTender[]> {
    return ApplicationRepository.listByCompany(companyId);
  }

  /**
   * Updates an application status or notes with strict IDOR verification guard.
   */
  static async updateApplication(
    companyId: string,
    applicationId: string,
    rawInput: unknown
  ): Promise<Application> {
    const application = await ApplicationRepository.findById(applicationId);
    if (!application) {
      throw new ApplicationNotFoundError();
    }

    // IDOR Protection: Verify resource ownership
    AuthService.verifyCompanyAccess(companyId, application.companyId);

    const parseResult = UpdateApplicationSchema.safeParse(rawInput);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
      throw new ApplicationValidationError(errorMsg);
    }

    return ApplicationRepository.update(applicationId, parseResult.data);
  }

  /**
   * Deletes an application tracking entry with IDOR protection.
   */
  static async deleteApplication(companyId: string, applicationId: string): Promise<Application> {
    const application = await ApplicationRepository.findById(applicationId);
    if (!application) {
      throw new ApplicationNotFoundError();
    }

    // IDOR Protection: Verify resource ownership
    AuthService.verifyCompanyAccess(companyId, application.companyId);

    return ApplicationRepository.delete(applicationId);
  }
}
