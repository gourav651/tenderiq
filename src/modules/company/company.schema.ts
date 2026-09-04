import { z } from "zod";

export const CreateCompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters").max(100),
  description: z.string().optional(),
  industry: z.string().min(2, "Industry is required"),
  website: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  location: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  annualTurnover: z.number().nonnegative("Annual turnover must be a positive number").optional(),
  yearsOfExperience: z.number().int().nonnegative("Years of experience must be 0 or greater").optional(),
  certifications: z.array(z.string()).default([]),
  areasOfOperation: z.array(z.string()).default([]),
  procurementPreferences: z.record(z.string(), z.any()).optional(),
});

export const UpdateCompanySchema = CreateCompanySchema.partial();

export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>;
