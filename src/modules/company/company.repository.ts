import { prisma } from "@/lib/prisma";
import { Company, Prisma } from "@/generated/prisma/client";
import { CreateCompanyInput, UpdateCompanyInput } from "./company.schema";

export class CompanyRepository {
  static async findById(id: string): Promise<Company | null> {
    return prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            applications: true,
          },
        },
      },
    });
  }

  static async create(data: CreateCompanyInput): Promise<Company> {
    const createData: Prisma.CompanyCreateInput = {
      name: data.name,
      description: data.description,
      industry: data.industry,
      website: data.website || null,
      location: data.location,
      state: data.state,
      city: data.city,
      annualTurnover: data.annualTurnover !== undefined ? new Prisma.Decimal(data.annualTurnover) : null,
      yearsOfExperience: data.yearsOfExperience,
      certifications: data.certifications,
      areasOfOperation: data.areasOfOperation,
      procurementPreferences: data.procurementPreferences ? (data.procurementPreferences as Prisma.InputJsonValue) : Prisma.JsonNull,
    };

    return prisma.company.create({
      data: createData,
    });
  }

  static async update(id: string, data: UpdateCompanyInput): Promise<Company> {
    const updateData: Prisma.CompanyUpdateInput = {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.industry && { industry: data.industry }),
      ...(data.website !== undefined && { website: data.website || null }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.state !== undefined && { state: data.state }),
      ...(data.city !== undefined && { city: data.city }),
      ...(data.annualTurnover !== undefined && { annualTurnover: new Prisma.Decimal(data.annualTurnover) }),
      ...(data.yearsOfExperience !== undefined && { yearsOfExperience: data.yearsOfExperience }),
      ...(data.certifications && { certifications: data.certifications }),
      ...(data.areasOfOperation && { areasOfOperation: data.areasOfOperation }),
      ...(data.procurementPreferences !== undefined && {
        procurementPreferences: data.procurementPreferences ? (data.procurementPreferences as Prisma.InputJsonValue) : Prisma.JsonNull,
      }),
    };

    return prisma.company.update({
      where: { id },
      data: updateData,
    });
  }

  static async linkUserToCompany(userId: string, companyId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { companyId },
    });
  }
}
