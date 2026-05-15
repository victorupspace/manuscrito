import Link from "next/link";

import { BetaBadge } from "@/components/landing/beta-badge";

/**
 * Lado institucional da tela de login.
 *
 * Mantém o vocabulário visual da landing (wordmark + ornamento editorial),
 * para que `/login` pareça extensão natural da homepage.
 */
export function LoginHero() {
  return (
    <div className="flex h-full w-full flex-col justify-between gap-8 px-6 py-10 sm:px-10 md:px-12 lg:px-16 xl:px-20 lg:py-14">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex flex-col leading-none text-brand-carvao outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/40 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-marfim rounded-sm"
          aria-label="Manuscrito — voltar à página inicial"
        >
          <span className="font-serif italic text-2xl tracking-tight md:text-[1.75rem]">
            Manuscrito
          </span>
          <span className="mt-1 font-serif text-[0.6rem] uppercase tracking-[0.32em] text-brand-tinta">
            Editorial · Anno mmxxvi
          </span>
        </Link>

        <BetaBadge tone="light" className="hidden sm:inline-flex">
          Beta aberto
        </BetaBadge>
      </header>

      <div className="flex flex-1 flex-col justify-center">
        <BetaBadge tone="light" className="mb-6 self-start sm:hidden">
          Beta aberto
        </BetaBadge>

        <h1 className="font-serif text-[2.2rem] leading-[1.08] tracking-[-0.01em] text-brand-carvao sm:text-[2.6rem] md:text-[3rem] lg:text-[3.4rem] xl:text-[3.6rem]">
          Entre para continuar{" "}
          <em className="italic text-brand-bordo">escrevendo</em>.
        </h1>

        <p className="mt-5 max-w-xl font-serif text-base leading-[1.7] text-brand-grafite sm:text-[1.05rem] md:text-[1.1rem]">
          Acesse sua conta e continue organizando suas histórias, livros, contos
          e projetos de escrita.
        </p>

        <p className="mt-6 max-w-md font-serif text-[0.78rem] uppercase tracking-[0.28em] text-brand-tinta">
          — Vol. I · 2026 —
        </p>
      </div>

      <footer className="flex items-end justify-between gap-4 text-[0.72rem]">
        <p className="max-w-xs font-serif italic leading-snug text-brand-tinta">
          “A escrita é um ofício solitário, mas quem escreve nunca está só.”
        </p>
        <p className="font-serif uppercase tracking-[0.28em] text-brand-cinza">
          São Paulo · Brasil
        </p>
      </footer>
    </div>
  );
}
