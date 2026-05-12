"use client";

import { motion } from "framer-motion";
import { PenLine } from "lucide-react";

import { NewProjectDialog } from "@/components/platform/new-project-dialog";

export function EmptyState({
  title = "Seu primeiro projeto começa aqui.",
  text = "Crie um conto, livro ou rascunho e comece a organizar suas ideias com clareza.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-md border border-dashed border-brand-bordo/25 bg-brand-creme/45 p-8 text-center"
    >
      <span className="mx-auto flex size-12 items-center justify-center rounded-md bg-brand-marfim text-brand-bordo">
        <PenLine className="size-5" />
      </span>
      <h3 className="mt-4 font-serif text-[1.35rem] italic text-brand-bordo">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md font-serif text-[0.95rem] leading-relaxed text-brand-tinta">
        {text}
      </p>
      <div className="mt-5">
        <NewProjectDialog />
      </div>
    </motion.div>
  );
}
