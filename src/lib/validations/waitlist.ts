import { z } from "zod";

// Telefone brasileiro: aceitamos apenas DDD + número.
// Formatos válidos após extração dos dígitos:
//   - 10 dígitos: fixo  → (11) 3000-0000
//   - 11 dígitos: móvel → (11) 90000-0000 (terceiro dígito = 9)
export function extractPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatBrazilianPhone(value: string): string {
  const digits = extractPhoneDigits(value).slice(0, 11);
  const len = digits.length;
  if (len === 0) return "";
  if (len <= 2) return `(${digits}`;
  if (len <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (len <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export const waitlistSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Informe seu nome completo.")
      .max(120, "Nome muito longo.")
      .refine(
        (value) => value.split(/\s+/).filter(Boolean).length >= 2,
        "Inclua nome e sobrenome.",
      ),
    phone: z
      .string()
      .trim()
      .min(1, "Informe seu telefone.")
      .refine(
        (value) => {
          const digits = extractPhoneDigits(value);
          if (digits.length !== 10 && digits.length !== 11) return false;
          const ddd = Number.parseInt(digits.slice(0, 2), 10);
          if (Number.isNaN(ddd) || ddd < 11 || ddd > 99) return false;
          // Para celulares (11 dígitos), o terceiro dígito deve ser 9.
          if (digits.length === 11 && digits[2] !== "9") return false;
          return true;
        },
        "Informe um telefone brasileiro com DDD.",
      ),
    email: z
      .string()
      .trim()
      .min(1, "Informe seu email.")
      .email("Email em formato inválido."),
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

export type WaitlistInput = z.infer<typeof waitlistSchema>;
