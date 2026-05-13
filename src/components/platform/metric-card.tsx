"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Icon } from "@/components/ui/icon";

export function MetricCard({
  label,
  value,
  helper,
  icon,
  index = 0,
}: {
  label: string;
  value: string | number;
  helper: string;
  /** Nome do Material Symbols Outlined (ex.: "edit_note"). */
  icon: string;
  index?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      className="rounded-md border border-border-subtle bg-surface-1 p-4 shadow-xs transition-shadow hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-text-muted">
          {label}
        </p>
        <span className="flex size-9 items-center justify-center rounded-md bg-brand-primary-soft text-brand-primary">
          <Icon name={icon} opticalSize={20} className="text-[20px]" />
        </span>
      </div>
      <p className="font-num mt-4 text-[1.85rem] font-bold leading-none tracking-tight text-text-primary">
        {value}
      </p>
      <p className="mt-2 text-[0.85rem] leading-snug text-text-secondary">
        {helper}
      </p>
    </motion.article>
  );
}
