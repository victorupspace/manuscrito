"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/login";

export type LoginUserState = {
  error?: string;
  reason?: "invalid_credentials" | "not_approved" | "suspended" | "removed";
};

const GENERIC_ERROR =
  "Não foi possível acessar. Verifique seus dados e tente novamente.";
const NOT_APPROVED_MESSAGE =
  "Sua conta ainda não está ativa. Tente criar a conta novamente ou fale com o suporte.";
const SUSPENDED_MESSAGE =
  "Sua conta está temporariamente suspensa. Entre em contato com o suporte.";
const REMOVED_MESSAGE =
  "Sua conta foi encerrada. Caso queira retornar, solicite novo acesso.";

/**
 * Server action de login do usuário comum.
 *
 * Fluxo:
 *  1. Valida email/senha contra o schema do Zod.
 *  2. Chama `signInWithPassword` do Supabase Auth.
 *  3. Verifica se há perfil ativo em `public.customers`.
 *  4. Se ativo, redireciona para `/plataforma`.
 *  5. Caso contrário, encerra a sessão e devolve erro específico.
 *
 * Mensagens nunca revelam se o email existe — manter idêntico ao padrão do
 * backoffice (ver `loginBackofficeAction`).
 */
export async function loginUserAction(
  _prev: LoginUserState | undefined,
  formData: FormData,
): Promise<LoginUserState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { error: GENERIC_ERROR, reason: "invalid_credentials" };
  }

  const supabase = await createSupabaseServerClient();
  const email = parsed.data.email.toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { error: GENERIC_ERROR, reason: "invalid_credentials" };
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("status")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!customer) {
    await supabase.auth.signOut();
    return { error: NOT_APPROVED_MESSAGE, reason: "not_approved" };
  }

  const status = (customer as { status: string }).status;

  if (status === "suspended") {
    await supabase.auth.signOut();
    return { error: SUSPENDED_MESSAGE, reason: "suspended" };
  }

  if (status === "removed") {
    await supabase.auth.signOut();
    return { error: REMOVED_MESSAGE, reason: "removed" };
  }

  if (status !== "active") {
    await supabase.auth.signOut();
    return { error: NOT_APPROVED_MESSAGE, reason: "not_approved" };
  }

  redirect("/plataforma");
}
