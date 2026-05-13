import { redirect } from "next/navigation";

import { BackofficeLoginForm } from "@/components/backoffice/backoffice-login-form";
import { getBackofficeSession } from "@/lib/backoffice/auth";

export const metadata = {
  title: "Backoffice — Manuscrito",
};

// Lê o cookie de sessão admin para redirecionar quem já está logado.
export const dynamic = "force-dynamic";

export default async function BackofficeLoginPage() {
  const session = await getBackofficeSession();
  if (session) {
    redirect("/backoffice");
  }

  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-brand-bordo px-6 py-12 text-brand-marfim sm:px-10">
      {/* Profundidade — gradientes e textura sutil, mesmo vocabulário da landing */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_0%,rgba(245,241,232,0.10),transparent_55%),radial-gradient(120%_120%_at_100%_100%,rgba(0,0,0,0.45),transparent_55%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(rgba(245,241,232,0.7)_1px,transparent_1px)] bg-size-[18px_18px]"
      />

      <div className="brand-glass relative w-full max-w-md rounded-lg px-7 py-9 sm:px-9 sm:py-10">
        <div
          aria-hidden
          className="mb-6 flex items-center justify-center gap-3 text-brand-marfim/55"
        >
          <span className="h-px w-8 bg-current opacity-60" />
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.24em]">
            Backoffice
          </span>
          <span className="h-px w-8 bg-current opacity-60" />
        </div>

        <header className="text-center">
          <h1 className="text-[1.6rem] font-bold leading-tight tracking-tight text-brand-marfim sm:text-[1.85rem]">
            Acesso administrativo
          </h1>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-brand-marfim/75">
            Área restrita ao curador do projeto.
          </p>
        </header>

        <div className="mt-6">
          <BackofficeLoginForm />
        </div>

        <p className="mt-6 text-center text-[0.7rem] font-bold uppercase tracking-[0.18em] text-brand-marfim/45">
          Anno mmxxvi
        </p>
      </div>
    </main>
  );
}
