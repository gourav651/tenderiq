import { prisma } from "@/lib/prisma";
import { Prisma, Tender } from "@/generated/prisma/client";
import { QueryTendersInput } from "./tender.schema";

export type TenderWithDetails = Prisma.TenderGetPayload<{
  include: {
    documents: true;
    requirements: true;
    aiAnalyses: true;
  };
}>;

export class TenderRepository {
  /**
   * Retrieves paginated list of tenders based on filter criteria.
   */
  static async findMany(params: QueryTendersInput): Promise<{ tenders: Tender[]; totalCount: number }> {
    const {
      page,
      limit,
      search,
      category,
      state,
      organization,
      tenderType,
      status,
      minEstimatedValue,
      maxEstimatedValue,
      sortBy,
      sortOrder,
    } = params;

    const where: Prisma.TenderWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (tenderType) {
      where.tenderType = tenderType;
    }

    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (state) {
      where.state = { equals: state, mode: "insensitive" };
    }

    if (organization) {
      where.organization = { contains: organization, mode: "insensitive" };
    }

    if (minEstimatedValue !== undefined || maxEstimatedValue !== undefined) {
      where.estimatedValue = {};
      if (minEstimatedValue !== undefined) {
        where.estimatedValue.gte = minEstimatedValue;
      }
      if (maxEstimatedValue !== undefined) {
        where.estimatedValue.lte = maxEstimatedValue;
      }
    }

    if (search && search.trim()) {
      const trimmedSearch = search.trim();
      where.OR = [
        { title: { contains: trimmedSearch, mode: "insensitive" } },
        { description: { contains: trimmedSearch, mode: "insensitive" } },
        { referenceNumber: { contains: trimmedSearch, mode: "insensitive" } },
        { organization: { contains: trimmedSearch, mode: "insensitive" } },
        { category: { contains: trimmedSearch, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [tenders, totalCount] = await Promise.all([
      prisma.tender.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.tender.count({ where }),
    ]);

    return { tenders, totalCount };
  }

  /**
   * Retrieves full details for a specific tender by ID.
   */
  static async findById(id: string): Promise<TenderWithDetails | null> {
    return prisma.tender.findUnique({
      where: { id },
      include: {
        documents: {
          orderBy: { createdAt: "asc" },
        },
        requirements: {
          orderBy: { isMandatory: "desc" },
        },
        aiAnalyses: {
          where: { companyId: null }, // Global AI summary analyses
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Fetches distinct categories available in tenders database.
   */
  static async getDistinctCategories(): Promise<string[]> {
    const results = await prisma.tender.findMany({
      select: { category: true },
      distinct: ["category"],
    });
    return results.map((r) => r.category).filter(Boolean);
  }

  /**
   * Fetches distinct states available in tenders database.
   */
  static async getDistinctStates(): Promise<string[]> {
    const results = await prisma.tender.findMany({
      select: { state: true },
      distinct: ["state"],
      where: { state: { not: null } },
    });
    return results.map((r) => r.state as string).filter(Boolean);
  }
}
