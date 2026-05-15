import Link from "next/link";

import { cn } from "@/lib/utils";

type LoginEntryProps = {
  /**
   * Variante visual:
   *  - `light` → para uso no lado creme da landing (texto em vinho).
   *  - `dark`  → para uso no lado vinho da landing (texto em marfim).
   */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Microcopy editorial com chamada para o login.
 *
 * Discreto por design: não compete com o formulário principal de cadastro.
 * Aparece duas vezes na landing:
 *  - no topo direito do lado creme (chamada imediata para quem já tem conta);
 *  - logo abaixo do formulário, no lado vinho, como tom de "confirmação".
 */
export function LoginEntry({ tone = "light", className }: LoginEntryProps) {
  const isLight = tone === "light";

  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-1 font-serif text-[0.85rem]",
        isLight ? "text-brand-tinta" : "text-brand-marfim/65",
        className,
      )}
    >
      <span className="italic">Já tem conta?</span>
      <Link
        href="/login"
        className={cn(
          "inline-flex items-center gap-1.5 font-medium underline-offset-4 outline-none transition-colors rounded-sm",
          isLight
            ? "text-brand-bordo hover:text-brand-bordo-profundo hover:underline focus-visible:text-brand-bordo-profundo focus-visible:underline focus-visible:ring-2 focus-visible:ring-brand-bordo/40 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-marfim active:translate-y-px"
            : "text-brand-marfim hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo active:translate-y-px",
        )}
      >
        Entrar na plataforma
        <span
          aria-hidden
          className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    </p>
  );
}
