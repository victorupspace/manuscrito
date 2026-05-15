import { redirect } from "next/navigation";

import { LoginPage } from "@/components/auth/login-page";
import { getCurrentUserProfile } from "@/lib/auth/require-approved-user";
import type { LoginUserState } from "@/features/auth/actions/login-user";

export const metadata = {
  title: "Entrar na plataforma — Manuscrito",
  description:
    "Acesse sua conta e continue organizando suas histórias, livros, contos e projetos de escrita.",
};

// Lê cookies Supabase para detectar usuários já logados → não pode ser
// pré-renderizada estaticamente.
export const dynamic = "force-dynamic";

type LoginRouteProps = {
  searchParams?: Promise<{ reason?: string }>;
};

const REASON_MESSAGES: Record<NonNullable<LoginUserState["reason"]>, string> = {
  invalid_credentials:
    "Não foi possível acessar. Verifique seus dados e tente novamente.",
  not_approved:
    "Sua conta ainda não está ativa. Tente criar a conta novamente ou fale com o suporte.",
  suspended:
    "Sua conta está temporariamente suspensa. Entre em contato com o suporte.",
  removed:
    "Sua conta foi encerrada. Caso queira retornar, solicite novo acesso.",
};

function normalizeReason(
  raw: string | undefined,
): LoginUserState["reason"] | undefined {
  if (!raw) return undefined;
  if (
    raw === "invalid_credentials" ||
    raw === "not_approved" ||
    raw === "suspended" ||
    raw === "removed"
  ) {
    return raw;
  }
  // Mapeia os valores que `require-approved-user` injeta via `?reason=`.
  if (raw === "pending") return "not_approved";
  return undefined;
}

export default async function Login({ searchParams }: LoginRouteProps) {
  // Se o usuário já estiver autenticado e ativo, evita reentrar no login.
  const profile = await getCurrentUserProfile();
  if (profile.status === "ok") {
    redirect("/plataforma");
  }

  const params = (await searchParams) ?? {};
  const reason = normalizeReason(params.reason);
  const message = reason ? REASON_MESSAGES[reason] : undefined;
  const notice =
    params.reason === "password_updated"
      ? "Senha atualizada com sucesso. Faça login com sua nova senha."
      : undefined;

  return (
    <LoginPage
      initialReason={reason}
      initialMessage={message}
      notice={notice}
    />
  );
}
