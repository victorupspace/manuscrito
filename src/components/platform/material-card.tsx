"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Clock3, MoreHorizontal } from "lucide-react";

import {
  PROJECT_TYPE_ICONS,
  PROJECT_TYPE_LABELS,
} from "@/constants/project-types";
import type { UserProject } from "@/types/project";

const statusLabel: Record<UserProject["status"], string> = {
  active: "Em andamento",
  paused: "Pausado",
  completed: "Concluído",
  archived: "Arquivado",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function MaterialCard({
  project,
  index,
}: {
  project: UserProject;
  index: number;
}) {
  const Icon = PROJECT_TYPE_ICONS[project.type];
  const updatedAt = project.updatedAt
    ? dateFormatter.format(new Date(project.updatedAt))
    : "Sem edição";

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.035 }}
      whileHover={{ y: -2 }}
      className="group rounded-md border border-brand-bordo/10 bg-brand-marfim p-4 shadow-[0_18px_55px_-48px_rgba(31,27,22,0.55)] transition-colors hover:border-brand-bordo/25"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-md bg-brand-creme text-brand-bordo">
          <Icon className="size-5" />
        </span>
        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-md text-brand-tinta transition-colors hover:bg-brand-creme hover:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none"
          aria-label="Mais opções"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      <div className="mt-5">
        <p className="font-serif text-[0.7rem] uppercase tracking-[0.24em] text-brand-tinta/70">
          {PROJECT_TYPE_LABELS[project.type]} · {statusLabel[project.status]}
        </p>
        <h3 className="mt-2 line-clamp-2 font-serif text-[1.25rem] italic leading-tight text-brand-carvao">
          {project.title}
        </h3>
        <p className="mt-3 line-clamp-2 min-h-[2.75rem] font-serif text-[0.9rem] leading-relaxed text-brand-tinta">
          {project.description ||
            "Um espaço reservado para desenvolver este material com calma."}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-brand-bordo/10 pt-4">
        <div className="font-serif text-[0.82rem] text-brand-tinta">
          <span className="text-brand-carvao">
            {numberFormatter.format(project.wordCount)}
          </span>{" "}
          palavras
        </div>
        <div className="inline-flex items-center gap-1.5 font-serif text-[0.78rem] text-brand-cinza">
          <Clock3 className="size-3.5" />
          {updatedAt}
        </div>
      </div>

      <Link
        href={`/plataforma/escrita/${project.id}`}
        className="mt-4 inline-flex items-center gap-2 font-serif text-[0.9rem] text-brand-bordo underline-offset-4 transition-colors hover:text-brand-bordo-profundo hover:underline focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none"
      >
        Continuar escrevendo
        <ArrowUpRight className="size-4" />
      </Link>
    </motion.article>
  );
}
