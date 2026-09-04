import { User, Company } from "@/generated/prisma/client";

export interface AuthenticatedUser extends User {
  role: "USER" | "ADMIN";
}

export interface AuthContext {
  user: AuthenticatedUser;
  companyId: string | null;
}

export interface CompanyAuthContext {
  user: AuthenticatedUser;
  company: Company;
}
