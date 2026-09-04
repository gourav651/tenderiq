import { z } from "zod";
import { TenderType, TenderStatus } from "@/generated/prisma/client";

export const QueryTendersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  aiQuery: z.string().optional(),
  category: z.string().optional(),
  state: z.string().optional(),
  organization: z.string().optional(),
  tenderType: z.nativeEnum(TenderType).optional(),
  status: z.nativeEnum(TenderStatus).optional(),
  minEstimatedValue: z.coerce.number().nonnegative().optional(),
  maxEstimatedValue: z.coerce.number().nonnegative().optional(),
  sortBy: z.enum(["submissionDeadline", "publishedAt", "estimatedValue", "createdAt"]).default("submissionDeadline"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type QueryTendersInput = z.infer<typeof QueryTendersSchema>;

export const TenderIdParamSchema = z.object({
  id: z.string().uuid("Invalid tender ID format"),
});
