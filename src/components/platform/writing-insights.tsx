"use client";

import { motion } from "framer-motion";

import { WRITING_INSIGHTS } from "@/constants/writing-insights";

export function WritingInsights() {
  return (
    <section className="space-y-5">
      <div>
        <p className="font-serif text-[0.7rem] uppercase tracking-[0.3em] text-brand-tinta/70">
          Oficina
        </p>
        <h2 className="mt-1 font-serif text-[1.7rem] italic text-brand-bordo">
          Para melhorar sua escrita
        </h2>
        <p className="mt-1 font-serif text-[0.96rem] text-brand-tinta">
          Pequenas orientações para transformar ideias em projetos mais
          consistentes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {WRITING_INSIGHTS.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.article
              key={insight.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: index * 0.04 }}
              className="rounded-md border border-brand-bordo/10 bg-brand-creme/55 p-4 transition-colors hover:border-brand-bordo/24 hover:bg-brand-creme"
            >
              <span className="flex size-9 items-center justify-center rounded-md bg-brand-marfim text-brand-bordo">
                <Icon className="size-4" />
              </span>
              <h3 className="mt-4 font-serif text-[1.08rem] italic text-brand-carvao">
                {insight.title}
              </h3>
              <p className="mt-2 font-serif text-[0.9rem] leading-relaxed text-brand-tinta">
                {insight.text}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
