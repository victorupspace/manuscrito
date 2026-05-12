import { z } from "zod";

import { PROJECT_TYPES } from "@/constants/project-types";

export const projectCreateSchema = z.object({
  type: z.enum(PROJECT_TYPES, {
    error: "Escolha o tipo de projeto.",
  }),
  title: z
    .string()
    .trim()
    .min(2, "Informe um nome para o projeto.")
    .max(160, "Use um nome mais curto."),
  description: z
    .string()
    .trim()
    .max(800, "A descrição pode ter no máximo 800 caracteres.")
    .nullable()
    .optional(),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
