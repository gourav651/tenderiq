import { z } from "zod";
import { ApplicationStatus } from "@/generated/prisma/client";

export const CreateApplicationSchema = z.object({
  tenderId: z.string().uuid("Invalid tender ID"),
  status: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.SAVED),
  notes: z.string().max(2000).optional(),
});

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;

export const UpdateApplicationSchema = z.object({
  status: z.nativeEnum(ApplicationStatus).optional(),
  notes: z.string().max(2000).optional(),
});

export type UpdateApplicationInput = z.infer<typeof UpdateApplicationSchema>;
