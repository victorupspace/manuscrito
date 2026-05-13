"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Icon } from "@/components/ui/icon";
import { NewProjectDialog } from "@/components/platform/new-project-dialog";

export function WelcomePanel({ firstName }: { firstName: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-lg border border-border-subtle bg-surface-1 p-6 shadow-sm sm:p-8"
    >
      <div className="relative max-w-3xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-default bg-surface-2 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-text-secondary">
          <Icon
            name="edit_note"
            opticalSize={20}
            className="text-[16px] text-brand-primary"
          />
          Biblioteca pessoal
        </div>
        <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-tight text-text-primary sm:text-[2.1rem] lg:text-[2.4rem]">
          Bem-vindo de volta,{" "}
          <span className="text-brand-primary">{firstName || "autor"}</span>.
        </h2>
        <p className="mt-4 max-w-2xl text-[1rem] leading-[1.6] text-text-secondary">
          Suas histórias estão reunidas em um espaço pensado para escrever com
          foco, organizar ideias e acompanhar sua evolução.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <NewProjectDialog triggerClassName="h-11 px-5" />
          <Link
            href="#materiais"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-default bg-surface-2 px-5 text-[0.92rem] font-bold text-brand-primary transition-colors hover:bg-surface-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Ver meus textos
            <Icon
              name="arrow_forward"
              opticalSize={20}
              className="text-[18px]"
            />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
