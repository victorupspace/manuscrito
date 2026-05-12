import { z } from "zod";

export const researchItemSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().trim().min(1).max(180),
  type: z.string().trim().min(1).max(80),
  url: z.string().url().nullable().optional(),
  notes: z.string().trim().max(12000).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).default([]),
});

export type ResearchItemInput = z.infer<typeof researchItemSchema>;
