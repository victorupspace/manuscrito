import Link from "next/link";

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
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-brand-bordo px-6 py-12 text-brand-marfim sm:px-10">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_0%,rgba(245,241,232,0.10),transparent_55%),radial-gradient(120%_120%_at_100%_100%,rgba(0,0,0,0.45),transparent_55%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(rgba(245,241,232,0.7)_1px,transparent_1px)] [background-size:18px_18px]"
      />

      <div className="brand-glass relative w-full max-w-md rounded-md px-7 py-9 sm:px-9 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            aria-label="Manuscrito — voltar à página inicial"
            className="font-serif italic text-xl text-brand-marfim outline-none focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo rounded-sm"
          >
            Manuscrito
          </Link>
          <span className="font-serif text-[0.6rem] uppercase tracking-[0.4em] text-brand-marfim/55">
            Anno mmxxvi
          </span>
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
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="font-serif text-[1.55rem] italic leading-tight text-brand-marfim sm:text-[1.75rem]">
          Link inválido
        </h2>
        <p
          role="alert"
          className="mt-3 font-serif text-[0.92rem] leading-relaxed text-brand-marfim/80"
        >
          {message}
        </p>
      </header>

      <Link
        href="/forgot-password"
        className="group relative mt-1 inline-flex items-center justify-center gap-3 rounded-sm border border-brand-marfim bg-brand-marfim px-6 py-3.5 font-serif text-[0.98rem] text-brand-bordo transition-all duration-200 outline-none hover:bg-brand-marfim/90 focus-visible:ring-2 focus-visible:ring-brand-marfim/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo active:translate-y-px"
      >
        Solicitar novo email
        <span
          aria-hidden
          className="inline-block translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>

      <p className="text-center font-serif text-[0.85rem] italic text-brand-marfim/75">
        <Link
          href="/login"
          className="underline-offset-4 transition-colors outline-none hover:text-brand-marfim hover:underline focus-visible:text-brand-marfim focus-visible:underline focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo rounded-sm"
        >
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
