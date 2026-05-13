"use client";

import { motion } from "framer-motion";

import { Icon } from "@/components/ui/icon";
import { WRITING_INSIGHTS } from "@/constants/writing-insights";
import { cn } from "@/lib/utils";

export function WritingInsights({ className }: { className?: string }) {
  return (
    <section className={cn("space-y-5", className)}>
      <div>
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-text-muted">
          Oficina
        </p>
        <h2 className="mt-1 text-[1.5rem] font-bold tracking-tight text-text-primary">
          Para melhorar sua escrita
        </h2>
        <p className="mt-1 text-[0.94rem] text-text-secondary">
          Pequenas orientações para transformar ideias em projetos mais
          consistentes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {WRITING_INSIGHTS.map((insight, index) => (
          <motion.article
            key={insight.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: index * 0.04 }}
            className="rounded-md border border-border-subtle bg-surface-1 p-4 shadow-xs transition-all hover:border-border-default hover:shadow-sm"
          >
            <span className="flex size-9 items-center justify-center rounded-md bg-brand-primary-soft text-brand-primary">
              <Icon
                name={insight.icon}
                opticalSize={20}
                className="text-[20px]"
              />
            </span>
            <h3 className="mt-4 text-[1rem] font-bold leading-snug tracking-tight text-text-primary">
              {insight.title}
            </h3>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-text-secondary">
              {insight.text}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
