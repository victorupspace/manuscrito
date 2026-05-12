import { z } from "zod";

export const locationSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(4000).nullable().optional(),
  notes: z.string().trim().max(8000).nullable().optional(),
});

export type LocationInput = z.infer<typeof locationSchema>;
