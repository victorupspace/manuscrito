import { z } from "zod";

export const writingTargetSchema = z.object({
  projectId: z.string().uuid(),
  documentNodeId: z.string().uuid().nullable().optional(),
  targetWords: z.number().int().positive("Informe uma meta maior que zero."),
  targetType: z.enum(["project", "document"]),
  dueDate: z.string().date().nullable().optional(),
});

export type WritingTargetInput = z.infer<typeof writingTargetSchema>;
