import { z } from "zod";

export const documentMetadataSchema = z.object({
  documentNodeId: z.string().uuid(),
  status: z.enum([
    "idea",
    "draft",
    "in_progress",
    "in_review",
    "review",
    "completed",
    "archived",
  ]),
  targetWords: z.number().int().positive().nullable().optional(),
  notes: z.string().trim().max(5000).nullable().optional(),
  synopsis: z.string().trim().max(2400).nullable().optional(),
  pov: z.string().trim().max(120).nullable().optional(),
  location: z.string().trim().max(160).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(48)).max(16).optional(),
});

export type DocumentMetadataInput = z.infer<typeof documentMetadataSchema>;
