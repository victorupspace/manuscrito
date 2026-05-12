"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, PenLine } from "lucide-react";

import { NewProjectDialog } from "@/components/platform/new-project-dialog";

export function WelcomePanel({ firstName }: { firstName: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-lg border border-brand-bordo/10 bg-brand-creme p-6 shadow-[0_28px_80px_-58px_rgba(31,27,22,0.65)] sm:p-8"
    >
      <span
        aria-hidden
        className="absolute -right-8 -bottom-16 hidden font-serif text-[15rem] italic leading-none text-brand-bordo/[0.055] select-none md:block"
      >
        M
      </span>
      <div className="relative max-w-3xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-bordo/12 bg-brand-marfim px-3 py-1 font-serif text-[0.72rem] uppercase tracking-[0.24em] text-brand-tinta">
          <PenLine className="size-3.5 text-brand-bordo" />
          Biblioteca pessoal
        </div>
        <h2 className="font-serif text-[2.25rem] leading-[1.05] text-brand-carvao sm:text-[3rem] lg:text-[3.35rem]">
          Bem-vindo de volta,{" "}
          <em className="italic text-brand-bordo">{firstName || "autor"}</em>.
        </h2>
        <p className="mt-5 max-w-2xl font-serif text-[1.02rem] leading-[1.75] text-brand-grafite sm:text-[1.12rem]">
          Suas histórias estão reunidas em um espaço pensado para escrever com
          foco, organizar ideias e acompanhar sua evolução.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <NewProjectDialog triggerClassName="h-11 px-5" />
          <Link
            href="#materiais"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-brand-bordo/15 bg-brand-marfim px-5 font-serif text-[0.95rem] text-brand-bordo transition-colors hover:bg-brand-pergaminho focus-visible:ring-2 focus-visible:ring-brand-bordo/35 focus-visible:outline-none"
          >
            Ver meus textos
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
