import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { AuthContext, CompanyAuthContext, AuthenticatedUser } from "./auth.types";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized. Please log in.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class CompanyRequiredError extends Error {
  constructor(message = "Company onboarding required. Please complete your company profile.") {
    super(message);
    this.name = "CompanyRequiredError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden. Access to this resource is denied.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class AuthService {
  /**
   * Retrieves current authenticated user session from headers.
   */
  static async getSession(reqHeaders?: Headers): Promise<AuthContext> {
    const reqH = reqHeaders || (await headers());
    const session = await auth.api.getSession({
      headers: reqH,
    });

    if (!session || !session.user) {
      throw new UnauthorizedError();
    }

    // Fetch user from DB to ensure latest role and companyId
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!dbUser) {
      throw new UnauthorizedError("User record not found");
    }

    return {
      user: dbUser as AuthenticatedUser,
      companyId: dbUser.companyId,
    };
  }

  /**
   * Enforces that user is authenticated AND belongs to an onboarded company.
   * Prevents IDOR and cross-tenant data access.
   */
  static async getAuthCompany(reqHeaders?: Headers): Promise<CompanyAuthContext> {
    const { user, companyId } = await this.getSession(reqHeaders);

    if (!companyId) {
      throw new CompanyRequiredError();
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new CompanyRequiredError("Associated company record not found.");
    }

    return {
      user,
      company,
    };
  }

  /**
   * Enforces IDOR protection by verifying resource companyId against user's companyId.
   */
  static verifyCompanyAccess(userCompanyId: string, resourceCompanyId: string): void {
    if (!userCompanyId || userCompanyId !== resourceCompanyId) {
      throw new ForbiddenError("You do not have permission to access resources outside your company.");
    }
  }
}
