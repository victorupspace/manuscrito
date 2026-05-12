"use server";

import { getBackofficeSession } from "@/lib/backoffice/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { recordAudit } from "@/features/backoffice/services/record-audit";

import type { AdminActionResult } from "./approve-signup-request";

export async function sendPasswordResetLinkAction(
  email: string,
): Promise<AdminActionResult> {
  const session = await getBackofficeSession();
  if (!session) {
    return { status: "error", message: "Sessão expirada." };
  }
  if (!email) {
    return { status: "error", message: "E-mail inválido." };
  }

  try {
    const supabase = createSupabaseAdminClient();
    // Disparo de e-mail de recuperação via Supabase Auth (server-side, com
    // service role). Em projetos com SMTP customizado, lembrar de configurar
    // o template "Reset password" no painel do Supabase.
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return { status: "error", message: error.message };
    }

    await recordAudit({
      actorEmail: session.email,
      action: "customer.password_reset_sent",
      targetType: "customer",
      payload: { email },
    });

    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error
          ? err.message
          : "Falha ao enviar link de redefinição.",
    };
  }
}
