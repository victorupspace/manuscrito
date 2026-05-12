import { z } from "zod";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { PROJECT_TYPES } from "@/constants/project-types";

export const projectSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).nullable().optional(),
  type: z.enum(PROJECT_TYPES),
  language: z.enum(SUPPORTED_LANGUAGES),
  targetWords: z.number().int().positive().nullable().optional(),
  deadline: z.string().datetime().nullable().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
