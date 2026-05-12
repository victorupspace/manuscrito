"use server";

import { redirect } from "next/navigation";

import {
  createBackofficeSession,
  verifyAdminCredentials,
} from "@/lib/backoffice/auth";

export type LoginBackofficeState = {
  error?: string;
};

const GENERIC_ERROR = "Credenciais inválidas.";

/**
 * Server action de login local do backoffice.
 *
 * Regras de segurança:
 * - Toda comparação acontece no servidor.
 * - Mensagem de erro é sempre genérica — não diferenciamos "email incorreto"
 *   de "senha incorreta".
 * - Em caso de sucesso, cria cookie httpOnly e redireciona para /backoffice.
 */
export async function loginBackofficeAction(
  _prev: LoginBackofficeState | undefined,
  formData: FormData,
): Promise<LoginBackofficeState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: GENERIC_ERROR };
  }

  // Pequeno custo fixo para suavizar oráculos de timing em produção.
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (!verifyAdminCredentials(email, password)) {
    return { error: GENERIC_ERROR };
  }

  await createBackofficeSession(email);
  redirect("/backoffice");
}
