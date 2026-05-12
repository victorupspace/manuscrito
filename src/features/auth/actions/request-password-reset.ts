"use server";

import { headers } from "next/headers";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { passwordResetRequestSchema } from "@/lib/validations/login";

export type PasswordResetState = {
  status?: "idle" | "ok" | "error";
  message?: string;
};

// Mensagem genérica intencional — não revelar se o email existe.
const GENERIC_OK =
  "Se o email estiver aprovado, você receberá instruções para redefinir sua senha.";
const GENERIC_ERROR =
  "Não foi possível solicitar a redefinição agora. Tente novamente em instantes.";

/**
 * Inicia o fluxo de "Esqueci minha senha".
 *
 * Sempre responde com a mesma mensagem de sucesso, independentemente do email
 * existir ou não — proteção contra enumeração de contas.
 */
export async function requestPasswordResetAction(
  _prev: PasswordResetState | undefined,
  formData: FormData,
): Promise<PasswordResetState> {
  const parsed = passwordResetRequestSchema.safeParse({
    email: String(formData.get("email") ?? ""),
  });

  if (!parsed.success) {
    return { status: "error", message: "Informe um email válido." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const headerStore = await headers();
    const origin =
      headerStore.get("origin") ??
      (headerStore.get("host")
        ? `https://${headerStore.get("host")}`
        : undefined);

    await supabase.auth.resetPasswordForEmail(parsed.data.email.toLowerCase(), {
      redirectTo: origin ? `${origin}/reset-password` : undefined,
    });

    // Resposta única — sem distinguir entre sucesso e email inexistente.
    return { status: "ok", message: GENERIC_OK };
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[auth] erro ao iniciar reset de senha:", err);
    }
    return { status: "error", message: GENERIC_ERROR };
  }
}
