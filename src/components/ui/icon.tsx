import { cn } from "@/lib/utils";

/**
 * Componente Icon — wrapper sobre Material Symbols Outlined (Google Fonts).
 *
 * Por que um wrapper?
 * ─────────────────────
 * 1. Padroniza tamanho, peso (variable axis `wght`), fill e fonte-óptica
 *    do Material Symbols em todo o sistema.
 * 2. Permite trocar a iconografia no futuro alterando apenas este arquivo.
 * 3. Mantém a ergonomia das props do lucide-react (`className`, tamanho via
 *    classes Tailwind) para que a migração seja cirúrgica.
 *
 * Como nomear os ícones
 * ─────────────────────
 * Use o nome exato do Google Fonts Icons (snake_case), ex.: `home`,
 * `edit_note`, `library_books`. Catálogo: https://fonts.google.com/icons.
 */
export type IconProps = React.HTMLAttributes<HTMLSpanElement> & {
  name: string;
  /** Estado preenchido (eixo FILL). Default: false (outlined). */
  filled?: boolean;
  /** Peso do traço (eixo wght). 300=fino, 400=normal, 500=médio, 700=bold. */
  weight?: 300 | 400 | 500 | 600 | 700;
  /** Tamanho óptico (eixo opsz, em px). Default: 24. */
  opticalSize?: 20 | 24 | 40 | 48;
};

export function Icon({
  name,
  filled = false,
  weight = 400,
  opticalSize = 24,
  className,
  style,
  ...props
}: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined select-none", className)}
      style={{
        fontVariationSettings: `"FILL" ${filled ? 1 : 0}, "wght" ${weight}, "GRAD" 0, "opsz" ${opticalSize}`,
        ...style,
      }}
      {...props}
    >
      {name}
    </span>
  );
}
