import { z } from "zod";

export const characterSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().trim().min(1).max(160),
  role: z.string().trim().max(120).nullable().optional(),
  description: z.string().trim().max(4000).nullable().optional(),
  notes: z.string().trim().max(8000).nullable().optional(),
});

export type CharacterInput = z.infer<typeof characterSchema>;
