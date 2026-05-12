import { z } from "zod";

export const documentMetadataSchema = z.object({
  documentNodeId: z.string().uuid(),
  status: z.enum(["draft", "in_review", "completed", "archived"]),
  targetWords: z.number().int().positive().nullable().optional(),
  notes: z.string().trim().max(5000).nullable().optional(),
});

export type DocumentMetadataInput = z.infer<typeof documentMetadataSchema>;
