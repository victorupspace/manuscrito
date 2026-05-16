import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { BetaBadge } from "@/components/landing/beta-badge";

/**
 * Lado institucional da tela de login.
 *
 * Mantém o vocabulário visual da landing (wordmark + ornamento editorial),
 * para que `/login` pareça extensão natural da homepage.
 */
export function LoginHero() {
  return (
    <div className="flex h-full w-full flex-col justify-between gap-10 px-5 py-8 sm:gap-10 sm:px-10 sm:py-10 md:px-12 lg:gap-8 lg:px-16 lg:py-14 xl:px-20">
      <header className="flex items-start justify-between gap-4">
        <BrandWordmark
          href="/"
          tone="dark"
          size="md"
          subtitle="Editorial · Anno mmxxvi"
        />

        <BetaBadge tone="light" className="hidden sm:inline-flex">
          Beta aberto
        </BetaBadge>
      </header>

      <div className="flex flex-1 flex-col justify-center">
        <BetaBadge tone="light" className="mb-5 self-start sm:hidden">
          Beta aberto
        </BetaBadge>

        <h1
          id="login-headline"
          className="font-serif text-[2rem] leading-[1.1] tracking-[-0.01em] text-brand-carvao sm:text-[2.6rem] md:text-[3rem] lg:text-[3.3rem] xl:text-[3.6rem]"
        >
          Entre para continuar{" "}
          <em className="italic text-brand-bordo">escrevendo</em>.
        </h1>

        <p className="mt-5 max-w-xl font-serif text-[0.98rem] leading-[1.65] text-brand-grafite sm:text-[1.05rem] sm:leading-[1.7] md:text-[1.1rem]">
          Acesse sua conta e continue organizando suas histórias, livros, contos
          e projetos de escrita.
        </p>

        <p className="mt-7 max-w-md font-serif text-[0.72rem] uppercase tracking-[0.28em] text-brand-tinta sm:text-[0.78rem]">
          — Vol. I · 2026 —
        </p>
      </div>

      <footer className="flex flex-col gap-3 text-[0.7rem] sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:text-[0.72rem]">
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
