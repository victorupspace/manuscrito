"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updatePasswordSchema } from "@/lib/validations/login";

export type UpdatePasswordState = {
  error?: string;
  fieldErrors?: {
    password?: string;
    confirmPassword?: string;
  };
};

const NO_SESSION_ERROR =
  "Seu link de redefinição expirou ou já foi usado. Solicite um novo email.";
const GENERIC_ERROR =
  "Não foi possível atualizar sua senha agora. Tente novamente em instantes.";

/**
 * Server action que finaliza o fluxo de redefinição de senha.
 *
 * Pré-requisito
 * ─────────────
 * A página `/reset-password` precisa ter trocado o `code` do link por uma
 * sessão Supabase (via `exchangeCodeForSession`) — fazemos isso no Server
 * Component da rota, antes do form renderizar. Aqui só atualizamos a senha
 * do usuário já autenticado pelo cookie de sessão temporária.
 *
 * Após atualizar, encerramos a sessão de recuperação para forçar o usuário a
 * logar novamente com a senha nova — isso evita que um link de reset
 * vazado mantenha sessão ativa.
 */
export async function updatePasswordAction(
  _prev: UpdatePasswordState | undefined,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const parsed = updatePasswordSchema.safeParse({
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!parsed.success) {
    const fieldErrors: UpdatePasswordState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "password" && !fieldErrors.password) {
        fieldErrors.password = issue.message;
      }
      if (key === "confirmPassword" && !fieldErrors.confirmPassword) {
        fieldErrors.confirmPassword = issue.message;
      }
    }
    return { fieldErrors };
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: NO_SESSION_ERROR };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (updateError) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[auth] erro ao atualizar senha:", updateError);
    }
    return {
      error: updateError.message || GENERIC_ERROR,
    };
  }

  // Encerra a sessão temporária criada pelo link de reset.
  // O usuário precisa logar novamente com a senha nova.
  await supabase.auth.signOut();

  redirect("/login?reason=password_updated");
}
