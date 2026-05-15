import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ApprovedUserStatus = "active" | "suspended" | "removed" | "pending";

export type ApprovedUserProfile = {
  authUserId: string;
  email: string;
  fullName: string;
  status: ApprovedUserStatus;
  plan: string | null;
};

/**
 * Identifica se o usuário autenticado pode acessar a plataforma.
 *
 * Fonte de verdade
 * ────────────────
 * 1. Supabase Auth — quem o usuário diz ser (`auth.users`).
 * 2. `public.customers` — perfil operacional do usuário cadastrado.
 *
 * Estados possíveis:
 *  - `customers.status = active` → liberado.
 *  - `customers.status = suspended|removed` → bloqueado, mensagem específica.
 *  - Sem linha em `customers` → conta sem perfil operacional ativo.
 *
 * Sempre que retornarmos "sem perfil ativo", encerramos a sessão para evitar que
 * o usuário fique logado em uma conta que não pode acessar nada.
 */
async function loadCurrentProfile(): Promise<
  | { status: "unauthenticated" }
  | { status: "ok"; profile: ApprovedUserProfile }
  | { status: "blocked"; reason: ApprovedUserStatus }
> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "unauthenticated" };
  }

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("id, email, full_name, status, plan")
    .eq("id", user.id)
    .maybeSingle();

  if (customerError) {
    // Em caso de erro de RLS ou rede, tratamos como bloqueado para evitar
    // acesso indevido. O usuário será redirecionado para /login.
    return { status: "blocked", reason: "pending" };
  }

  if (!customer) {
    return { status: "blocked", reason: "pending" };
  }

  const row = customer as {
    id: string;
    email: string;
    full_name: string;
    status: ApprovedUserStatus;
    plan: string | null;
  };

  if (row.status === "active") {
    return {
      status: "ok",
      profile: {
        authUserId: row.id,
        email: row.email,
        fullName: row.full_name,
        status: row.status,
        plan: row.plan,
      },
    };
  }

  return { status: "blocked", reason: row.status };
}

export const getCurrentUserProfile = cache(loadCurrentProfile);

/**
 * Guard para Server Components / layouts de páginas protegidas.
 *
 * Comportamento:
 *  - Não autenticado → redireciona para `/login`.
 *  - Bloqueado por status → encerra sessão e redireciona com `?reason=`.
 *  - Aprovado → retorna o perfil para uso no render.
 */
export async function requireApprovedUser(): Promise<ApprovedUserProfile> {
  const result = await getCurrentUserProfile();

  if (result.status === "unauthenticated") {
    redirect("/login");
  }

  if (result.status === "blocked") {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect(`/login?reason=${result.reason}`);
  }

  return result.profile;
}
