import { LogoutButton } from "@/components/auth/logout-button";
import { requireApprovedUser } from "@/lib/auth/require-approved-user";

export const metadata = {
  title: "Plataforma — Manuscrito",
};

// Garante que a verificação de sessão aconteça a cada requisição (não usar
// cache estático para conteúdo dependente da identidade do usuário).
export const dynamic = "force-dynamic";

/**
 * Placeholder da área interna da plataforma.
 *
 * Esta página existe apenas para validar a jornada:
 *  solicitar acesso → aprovação no backoffice → login → entrada autenticada.
 *
 * Toda a área de escrita (editor, sidebar de projetos, organização de
 * capítulos/cenas/notas, colaboração e pagamentos) será construída em
 * etapas seguintes a partir desta base.
 */
export default async function PlataformaPage() {
  const profile = await requireApprovedUser();
  const firstName = profile.fullName.split(/\s+/).filter(Boolean)[0] ?? "";

  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-brand-marfim text-brand-carvao">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 hidden font-serif text-[18rem] italic leading-none text-brand-bordo/[0.05] select-none lg:block"
      >
        M
      </span>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-6 py-10 sm:px-10 md:px-14 lg:py-14">
        <header className="flex items-center justify-between gap-4">
          <div className="flex flex-col leading-none">
            <span className="font-serif italic text-2xl tracking-tight text-brand-carvao md:text-[1.75rem]">
              Manuscrito
            </span>
            <span className="mt-1 font-serif text-[0.6rem] uppercase tracking-[0.32em] text-brand-tinta">
              Plataforma · Vol. I
            </span>
          </div>

          <LogoutButton />
        </header>

        <section className="flex flex-1 flex-col justify-center py-16">
          <div
            aria-hidden
            className="mb-8 flex items-center gap-3 text-brand-bordo/55"
          >
            <span className="h-px w-10 bg-current opacity-60" />
            <span className="font-serif text-[0.6rem] uppercase tracking-[0.4em]">
              Acesso aprovado
            </span>
          </div>

          <h1 className="font-serif text-[2.4rem] leading-[1.08] tracking-[-0.01em] text-brand-carvao sm:text-[2.8rem] md:text-[3.2rem] lg:text-[3.6rem]">
            Bem-vindo ao{" "}
            <em className="italic text-brand-bordo">Manuscrito</em>
            {firstName ? (
              <>
                ,{" "}
                <span className="italic text-brand-bordo">{firstName}</span>
              </>
            ) : null}
            .
          </h1>

          <p className="mt-6 max-w-2xl font-serif text-base leading-[1.7] text-brand-grafite sm:text-[1.05rem] md:text-[1.15rem]">
            Sua área de escrita será construída aqui. Em breve, você poderá
            organizar livros, contos, capítulos, cenas, notas e pesquisas
            neste ambiente — com foco, clareza e segurança.
          </p>

          <p className="mt-10 max-w-md font-serif text-[0.78rem] uppercase tracking-[0.28em] text-brand-tinta">
            — Vol. I · 2026 · São Paulo · Brasil —
          </p>
        </section>

        <footer className="flex items-end justify-between gap-4 text-[0.72rem]">
          <p className="max-w-md font-serif italic leading-snug text-brand-tinta">
            “A escrita é um ofício solitário, mas quem escreve nunca está só.”
          </p>
          <p className="font-serif uppercase tracking-[0.28em] text-brand-cinza">
            {profile.email}
          </p>
        </footer>
      </div>
    </main>
  );
}
