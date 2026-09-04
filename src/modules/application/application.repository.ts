import { prisma } from "@/lib/prisma";
import { Application, Prisma } from "@/generated/prisma/client";
import { CreateApplicationInput, UpdateApplicationInput } from "./application.schema";

export type ApplicationWithTender = Prisma.ApplicationGetPayload<{
  include: {
    tender: true;
  };
}>;

export class ApplicationRepository {
  /**
   * Creates a new application entry for a company and tender.
   */
  static async create(companyId: string, userId: string, input: CreateApplicationInput): Promise<Application> {
    return prisma.application.create({
      data: {
        companyId,
        createdByUserId: userId,
        tenderId: input.tenderId,
        status: input.status,
        notes: input.notes,
      },
    });
  }

  /**
   * Finds an application by ID.
   */
  static async findById(id: string): Promise<ApplicationWithTender | null> {
    return prisma.application.findUnique({
      where: { id },
      include: {
        tender: true,
      },
    });
  }

  /**
   * Finds existing application for a specific company and tender.
   */
  static async findByCompanyAndTender(companyId: string, tenderId: string): Promise<Application | null> {
    return prisma.application.findUnique({
      where: {
        companyId_tenderId: {
          companyId,
          tenderId,
        },
      },
    });
  }

  /**
   * Lists all applications for a company with tender info.
   */
  static async listByCompany(companyId: string): Promise<ApplicationWithTender[]> {
    return prisma.application.findMany({
      where: { companyId },
      include: {
        tender: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  /**
   * Updates status or notes for an application.
   */
  static async update(id: string, input: UpdateApplicationInput): Promise<Application> {
    return prisma.application.update({
      where: { id },
      data: {
        ...input,
        ...(input.status === "SUBMITTED" ? { submissionDate: new Date() } : {}),
      },
    });
  }

  /**
   * Deletes an application entry.
   */
  static async delete(id: string): Promise<Application> {
    return prisma.application.delete({
      where: { id },
    });
  }
}
