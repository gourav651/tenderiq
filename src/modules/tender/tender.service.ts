import { TenderRepository, TenderWithDetails } from "./tender.repository";
import { QueryTendersSchema, QueryTendersInput, TenderIdParamSchema } from "./tender.schema";
import { AIService, AISearchIntent } from "../ai/ai.service";
import { Tender } from "@/generated/prisma/client";

export class TenderNotFoundError extends Error {
  constructor(message = "Tender not found") {
    super(message);
    this.name = "TenderNotFoundError";
  }
}

export class TenderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TenderValidationError";
  }
}

export interface PaginatedTendersResult {
  tenders: Tender[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    aiIntent?: AISearchIntent;
  };
}

export class TenderService {
  /**
   * Search and filter tenders with pagination and optional AI natural language query parsing.
   */
  static async searchTenders(rawInput: unknown): Promise<PaginatedTendersResult> {
    const parseResult = QueryTendersSchema.safeParse(rawInput);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
      throw new TenderValidationError(errorMsg);
    }

    const queryInput = { ...parseResult.data };
    let aiIntent: AISearchIntent | undefined = undefined;

    // Process natural language AI query if supplied
    if (queryInput.aiQuery && queryInput.aiQuery.trim()) {
      aiIntent = await AIService.parseSearchIntent(queryInput.aiQuery);

      // Merge AI Intent parameters into query filters if explicit search params weren't already provided
      if (aiIntent.query && !queryInput.search) {
        queryInput.search = aiIntent.query;
      }
      if (aiIntent.category && !queryInput.category) {
        queryInput.category = aiIntent.category;
      }
      if (aiIntent.state && !queryInput.state) {
        queryInput.state = aiIntent.state;
      }
      if (aiIntent.tenderType && !queryInput.tenderType) {
        queryInput.tenderType = aiIntent.tenderType;
      }
      if (aiIntent.status && !queryInput.status) {
        queryInput.status = aiIntent.status;
      }
      if (aiIntent.minEstimatedValue !== undefined && queryInput.minEstimatedValue === undefined) {
        queryInput.minEstimatedValue = aiIntent.minEstimatedValue;
      }
      if (aiIntent.maxEstimatedValue !== undefined && queryInput.maxEstimatedValue === undefined) {
        queryInput.maxEstimatedValue = aiIntent.maxEstimatedValue;
      }
    }

    const { tenders, totalCount } = await TenderRepository.findMany(queryInput);

    const totalPages = Math.ceil(totalCount / queryInput.limit) || 1;

    return {
      tenders,
      meta: {
        page: queryInput.page,
        limit: queryInput.limit,
        totalCount,
        totalPages,
        aiIntent,
      },
    };
  }

  /**
   * Retrieves single tender by ID with full details (documents, requirements, AI summary).
   */
  static async getTenderDetails(id: string): Promise<TenderWithDetails> {
    const paramParse = TenderIdParamSchema.safeParse({ id });
    if (!paramParse.success) {
      throw new TenderValidationError("Invalid tender ID format");
    }

    const tender = await TenderRepository.findById(id);
    if (!tender) {
      throw new TenderNotFoundError();
    }

    return tender;
  }

  /**
   * Returns distinct categories and states for filter sidebars.
   */
  static async getFilterOptions() {
    const [categories, states] = await Promise.all([
      TenderRepository.getDistinctCategories(),
      TenderRepository.getDistinctStates(),
    ]);

    return {
      categories,
      states,
    };
  }
}
