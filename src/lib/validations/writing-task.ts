import { z } from "zod";

export const writingTaskCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Descreva a tarefa.")
    .max(160, "Use uma tarefa mais curta."),
  description: z
    .string()
    .trim()
    .max(600, "A descrição pode ter no máximo 600 caracteres.")
    .nullable()
    .optional(),
  projectId: z.string().uuid().nullable().optional(),
  dueDate: z.string().date().nullable().optional(),
});

export type WritingTaskCreateInput = z.infer<typeof writingTaskCreateSchema>;
