import { z } from "zod";

/**
 * Schema do formulário de login do usuário comum (escritor aprovado).
 *
 * Não confundir com o login do backoffice, que utiliza schema próprio em
 * `@/features/backoffice/auth`.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu email.")
    .email("Email em formato inválido."),
  password: z.string().min(1, "Informe sua senha."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu email.")
    .email("Email em formato inválido."),
});

export type PasswordResetRequestInput = z.infer<
  typeof passwordResetRequestSchema
>;

/**
 * Schema da troca efetiva de senha após o usuário acessar o link enviado por
 * email. Deve casar com as regras já usadas em `waitlistSchema` (mínimo 8,
 * máximo 72 — limite do bcrypt do GoTrue).
 */
export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres.")
      .max(72, "A senha pode ter no máximo 72 caracteres."),
    confirmPassword: z.string().min(1, "Repita sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem.",
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
