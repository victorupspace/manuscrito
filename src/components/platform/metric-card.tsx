"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  index = 0,
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  index?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      className="rounded-md border border-brand-bordo/10 bg-brand-creme/55 p-4 shadow-[0_18px_55px_-42px_rgba(31,27,22,0.45)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-serif text-[0.68rem] uppercase tracking-[0.25em] text-brand-tinta/70">
          {label}
        </p>
        <span className="flex size-9 items-center justify-center rounded-md bg-brand-marfim text-brand-bordo">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-5 font-serif text-[2rem] italic leading-none text-brand-bordo">
        {value}
      </p>
      <p className="mt-2 font-serif text-[0.86rem] leading-snug text-brand-tinta">
        {helper}
      </p>
    </motion.article>
  );
}
