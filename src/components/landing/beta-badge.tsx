import { cn } from "@/lib/utils";

type BetaBadgeProps = {
  className?: string;
  tone?: "light" | "dark";
  children?: React.ReactNode;
};

/**
 * Tag editorial — versalete em Caslon/Garamond, filete duplo lateral.
 * Refere-se aos "marcadores cerimoniais" descritos no VBL §III/§V.
 */
export function BetaBadge({
  className,
  tone = "light",
  children = "Beta privado",
}: BetaBadgeProps) {
  const palette =
    tone === "light"
      ? "border-brand-bordo/25 text-brand-bordo bg-brand-marfim/40"
      : "border-brand-marfim/30 text-brand-marfim bg-brand-marfim/[0.06]";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 rounded-full border px-4 py-1.5 font-serif text-[0.7rem] uppercase tracking-[0.32em]",
        palette,
        className,
      )}
    >
      <span
        aria-hidden
        className="h-px w-4 bg-current opacity-60"
      />
      <span className="font-medium">{children}</span>
      <span
        aria-hidden
        className="h-px w-4 bg-current opacity-60"
      />
    </span>
  );
}
