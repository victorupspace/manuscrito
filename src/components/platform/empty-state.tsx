"use client";

import { motion } from "framer-motion";

import { Icon } from "@/components/ui/icon";
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
      className="rounded-md border border-dashed border-border-strong bg-surface-muted p-8 text-center"
    >
      <span className="mx-auto flex size-12 items-center justify-center rounded-md bg-brand-primary-soft text-brand-primary">
        <Icon name="edit_note" opticalSize={24} className="text-[24px]" />
      </span>
      <h3 className="mt-4 text-[1.2rem] font-bold tracking-tight text-text-primary">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-[0.94rem] leading-relaxed text-text-secondary">
        {text}
      </p>
      <div className="mt-5">
        <NewProjectDialog />
      </div>
    </motion.div>
  );
}
