"use client";

import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { BetaBadge } from "@/components/landing/beta-badge";
import { LoginEntry } from "@/components/landing/login-entry";

export function LandingCopy() {
  return (
    <div className="flex h-full w-full flex-col justify-between gap-8 px-6 py-10 sm:px-10 md:px-12 lg:px-16 xl:px-20 lg:py-14">
      {/* Cabeçalho institucional (wordmark + acesso refinado para login) */}
      <header className="flex items-start justify-between gap-4">
        <BrandWordmark href="/" tone="dark" size="md" />

        <div className="flex flex-col items-end gap-2 sm:gap-3">
          <BetaBadge tone="light" className="hidden sm:inline-flex">
            Beta privado
          </BetaBadge>
          <LoginEntry tone="light" className="justify-end text-right" />
        </div>
      </header>

      {/* Núcleo narrativo */}
      <div className="flex flex-1 flex-col justify-center">
        <BetaBadge tone="light" className="mb-6 self-start sm:hidden">
          Beta privado
        </BetaBadge>

        <h1 className="font-serif text-[2.2rem] leading-[1.08] tracking-[-0.01em] text-brand-carvao sm:text-[2.6rem] md:text-[3rem] lg:text-[3.4rem] xl:text-[3.75rem]">
          Escreva, organize e desenvolva{" "}
          <em className="italic text-brand-bordo">suas histórias</em> em um só
          lugar.
        </h1>

        <p className="mt-5 max-w-xl font-serif text-base leading-[1.7] text-brand-grafite sm:text-[1.05rem] md:text-[1.1rem]">
          Manuscrito é uma ferramenta brasileira para autores que querem
          estruturar livros, contos, capítulos, cenas, notas e pesquisas — com
          foco, clareza e segurança.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="mailto:contato@manuscrito.app?subject=Fale%20conosco%20%E2%80%94%20Manuscrito"
            className="group inline-flex items-center gap-3 rounded-sm border border-brand-carvao/80 bg-transparent px-6 py-3 font-serif text-[0.95rem] text-brand-carvao transition-colors duration-200 outline-none hover:bg-brand-carvao hover:text-brand-marfim focus-visible:ring-2 focus-visible:ring-brand-bordo/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-marfim active:translate-y-px"
          >
            Fale conosco
            <span
              aria-hidden
              className="inline-block translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>

          <span className="font-serif text-[0.78rem] uppercase tracking-[0.28em] text-brand-tinta">
            — Vol. I · 2026 —
          </span>
        </div>
      </div>

      {/* Rodapé editorial */}
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
