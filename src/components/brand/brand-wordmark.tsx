import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  href?: string;
  subtitle?: string;
  tone?: "dark" | "light" | "brand";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: {
    title: "text-[1.45rem] sm:text-[1.65rem]",
    subtitle: "text-[0.58rem] tracking-[0.28em]",
  },
  md: {
    title: "text-2xl md:text-[1.75rem]",
    subtitle: "text-[0.6rem] tracking-[0.32em]",
  },
  lg: {
    title: "text-[2rem] sm:text-[2.4rem]",
    subtitle: "text-[0.66rem] tracking-[0.36em]",
  },
};

const toneClasses = {
  dark: {
    title: "text-brand-carvao",
    subtitle: "text-brand-tinta",
    focus: "focus-visible:ring-brand-bordo/40 focus-visible:ring-offset-brand-marfim",
  },
  light: {
    title: "text-brand-marfim",
    subtitle: "text-brand-marfim/70",
    focus: "focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-brand-bordo",
  },
  brand: {
    title: "text-brand-bordo",
    subtitle: "text-brand-tinta",
    focus: "focus-visible:ring-brand-bordo/40 focus-visible:ring-offset-surface-0",
  },
};

function BrandWordmarkContent({
  subtitle = "Estúdio de escrita",
  tone = "dark",
  size = "md",
}: Pick<BrandWordmarkProps, "subtitle" | "tone" | "size">) {
  const sizes = sizeClasses[size];
  const tones = toneClasses[tone];

  return (
    <>
      <span
        className={cn(
          "block font-serif italic leading-none tracking-tight",
          sizes.title,
          tones.title,
        )}
      >
        Manuscrito
      </span>
      <span
        className={cn(
          "mt-1.5 block font-serif uppercase leading-none",
          sizes.subtitle,
          tones.subtitle,
        )}
      >
        {subtitle}
      </span>
    </>
  );
}

export function BrandWordmark({
  href,
  subtitle = "Estúdio de escrita",
  tone = "dark",
  size = "md",
  className,
}: BrandWordmarkProps) {
  const tones = toneClasses[tone];
  const commonClassName = cn(
    "inline-flex flex-col leading-none rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    tones.focus,
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={commonClassName}
        aria-label="Manuscrito — Estúdio de escrita"
      >
        <BrandWordmarkContent subtitle={subtitle} tone={tone} size={size} />
      </Link>
    );
  }

  return (
    <div className={commonClassName}>
      <BrandWordmarkContent subtitle={subtitle} tone={tone} size={size} />
    </div>
  );
}
