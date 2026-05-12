import Link from "next/link";
import { redirect } from "next/navigation";

import { BackofficeLogoutButton } from "@/components/backoffice/backoffice-logout-button";
import { BackofficeNav } from "@/components/backoffice/backoffice-nav";
import { getBackofficeSession } from "@/lib/backoffice/auth";

export const metadata = {
  title: "Backoffice — Manuscrito",
};

// Layout protegido — todas as páginas filhas dependem de `cookies()` para
// validar a sessão admin, portanto precisam de renderização dinâmica.
export const dynamic = "force-dynamic";

export default async function BackofficeAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense-in-depth: o proxy já redireciona quando não há sessão, mas a
  // checagem é repetida aqui no servidor próximo ao consumo de dados.
  const session = await getBackofficeSession();
  if (!session) {
    redirect("/backoffice/login");
  }

  return (
    <div className="min-h-dvh bg-brand-creme text-brand-carvao">
      <header className="border-b border-brand-bordo/15 bg-brand-marfim/90 backdrop-blur supports-[backdrop-filter]:bg-brand-marfim/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Link
            href="/backoffice"
            className="flex items-baseline gap-2 font-serif"
          >
            <span className="text-[1.2rem] italic text-brand-bordo">
              Manuscrito
            </span>
            <span className="text-[0.68rem] uppercase tracking-[0.32em] text-brand-tinta/70">
              Backoffice
            </span>
          </Link>

          <BackofficeNav className="hidden md:block" />

          <div className="flex items-center gap-3">
            <span className="hidden font-serif text-[0.78rem] text-brand-tinta sm:inline">
              {session.email}
            </span>
            <BackofficeLogoutButton />
          </div>
        </div>
        <BackofficeNav className="md:hidden" variant="compact" />
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
