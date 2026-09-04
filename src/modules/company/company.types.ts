import { Company } from "@/generated/prisma/client";
import { CreateCompanyInput, UpdateCompanyInput } from "./company.schema";

export interface CompanyWithUserCount extends Company {
  _count?: {
    users: number;
    applications: number;
  };
}

export type { CreateCompanyInput, UpdateCompanyInput };
