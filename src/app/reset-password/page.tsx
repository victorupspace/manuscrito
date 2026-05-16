import Link from "next/link";

import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Redefinir senha — Manuscrito",
};

// O fluxo de reset depende de cookies de sessão escritos pelo Supabase a cada
// requisição — renderização estática quebraria o `exchangeCodeForSession`.
export const dynamic = "force-dynamic";

type ResetPasswordRouteProps = {
  searchParams?: Promise<{
    code?: string;
    error?: string;
    error_description?: string;
  }>;
};

const LINK_ERROR_MESSAGES: Record<string, string> = {
  access_denied:
    "O link de redefinição expirou ou já foi usado. Solicite um novo email para continuar.",
  otp_expired:
    "O link de redefinição expirou. Solicite um novo email para continuar.",
};

const GENERIC_LINK_ERROR =
  "Não foi possível validar este link. Solicite um novo email para continuar.";

/**
 * Página de finalização da redefinição de senha.
 *
 * Fluxo PKCE
 * ──────────
 * 1. O Supabase entrega um link tipo `<site>/reset-password?code=<pkce_code>`.
 * 2. Aqui no Server Component fazemos `exchangeCodeForSession(code)`, o que
 *    grava cookies de sessão temporária via `@supabase/ssr`.
 * 3. Com a sessão ativa, o `ResetPasswordForm` chama `updatePasswordAction`,
 *    que executa `supabase.auth.updateUser({ password })` e em seguida
 *    encerra a sessão para forçar novo login com a senha definitiva.
 *
 * Em caso de erro (link expirado, code inválido, etc), exibimos uma mensagem
 * orientando o usuário a solicitar um novo email.
 */
export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordRouteProps) {
  const params = (await searchParams) ?? {};

  let linkError: string | null = null;

  if (params.error) {
    linkError =
      LINK_ERROR_MESSAGES[params.error] ??
      params.error_description ??
      GENERIC_LINK_ERROR;
  } else if (params.code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) {
      linkError = GENERIC_LINK_ERROR;
    }
  } else {
    // Acesso direto sem code — checa se já existe uma sessão de recuperação.
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      linkError = GENERIC_LINK_ERROR;
    }
  }

  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-brand-bordo px-5 py-10 text-brand-marfim sm:px-10 sm:py-12">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_0%,rgba(245,241,232,0.10),transparent_55%),radial-gradient(120%_120%_at_100%_100%,rgba(0,0,0,0.45),transparent_55%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(rgba(245,241,232,0.7)_1px,transparent_1px)] bg-size-[18px_18px]"
      />

      <div className="brand-glass relative w-full max-w-md rounded-lg px-5 py-7 sm:px-8 sm:py-9">
        <div className="mb-6 flex items-start justify-between gap-4">
          <BrandWordmark
            href="/"
            tone="light"
            size="sm"
            subtitle="Anno mmxxvi"
          />
        </div>

        <div
          aria-hidden
          className="mb-6 flex items-center justify-center gap-3 text-brand-marfim/45"
        >
          <span className="h-px w-8 bg-current opacity-60" />
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.4em]">
            Nova senha
          </span>
          <span className="h-px w-8 bg-current opacity-60" />
        </div>

        {linkError ? (
          <ExpiredLinkPanel message={linkError} />
        ) : (
          <ResetPasswordForm />
        )}
      </div>
    </main>
  );
}

function ExpiredLinkPanel({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-4">
      <header className="text-center">
        <h2 className="text-[1.5rem] font-bold leading-tight tracking-tight text-brand-marfim sm:text-[1.8rem]">
          Link inválido
        </h2>
        <p
          role="alert"
          className="mx-auto mt-2 max-w-sm text-[0.9rem] leading-relaxed text-brand-marfim/80 sm:text-[0.93rem]"
        >
          {message}
        </p>
      </header>

      <Link
        href="/forgot-password"
        className="group relative mt-1 inline-flex items-center justify-center gap-3 rounded-md bg-brand-marfim px-6 py-3.5 text-[0.95rem] font-bold text-brand-bordo shadow-sm transition-all duration-200 outline-none hover:bg-brand-bordo-profundo hover:text-brand-marfim focus-visible:ring-2 focus-visible:ring-brand-marfim/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo active:translate-y-px"
      >
        Solicitar novo email
        <span
          aria-hidden
          className="inline-block translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>

      <p className="mt-2 text-center text-[0.82rem] text-brand-marfim/65">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-sm font-bold text-brand-marfim underline-offset-4 transition-colors outline-none hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo"
        >
          <span aria-hidden>←</span> Voltar para o login
        </Link>
      </p>
    </div>
  );
}
