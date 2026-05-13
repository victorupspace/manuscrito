"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowUpRight, Clock3, MoreHorizontal, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PROJECT_TYPE_ICONS,
  PROJECT_TYPE_LABELS,
} from "@/constants/project-types";
import { deleteProjectAction } from "@/features/projects/actions/delete-project";
import { cn } from "@/lib/utils";
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await deleteProjectAction(project.id);
      if (result.status === "ok") {
        setConfirmOpen(false);
        return;
      }
      setErrorMessage(result.message);
    });
  }

  return (
    <>
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

          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              aria-label={`Mais opções para ${project.title}`}
              className="inline-flex size-8 items-center justify-center rounded-md text-brand-tinta transition-colors hover:bg-brand-creme hover:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none data-[state=open]:bg-brand-creme data-[state=open]:text-brand-bordo"
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setErrorMessage(null);
                  setConfirmOpen(true);
                }}
                className="cursor-pointer font-serif text-[0.9rem] text-brand-bordo focus:bg-brand-bordo/10 focus:text-brand-bordo-profundo"
              >
                <Trash2 className="size-4" />
                Excluir material
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (isPending) return;
          setConfirmOpen(open);
          if (!open) setErrorMessage(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif italic text-brand-bordo">
              Excluir “{project.title}”?
            </DialogTitle>
            <DialogDescription className="font-serif text-brand-tinta">
              Esta ação é permanente. O material e tudo o que está dentro dele
              será removido. Suas tarefas associadas a este projeto permanecem
              salvas, mas perdem o vínculo.
            </DialogDescription>
          </DialogHeader>

          {errorMessage ? (
            <p
              role="alert"
              className="font-serif text-[0.85rem] leading-relaxed text-brand-bordo"
            >
              {errorMessage}
            </p>
          ) : null}

          <DialogFooter>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
              className="inline-flex h-10 items-center justify-center rounded-md border border-brand-bordo/20 px-4 font-serif text-[0.9rem] text-brand-tinta transition-colors hover:bg-brand-creme hover:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              aria-busy={isPending || undefined}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-bordo px-4 font-serif text-[0.9rem] text-brand-marfim transition-colors",
                "hover:bg-brand-bordo-profundo focus-visible:ring-2 focus-visible:ring-brand-bordo/40 focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              {isPending ? (
                <>
                  <Spinner />
                  <span>Excluindo…</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  <span>Excluir definitivamente</span>
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-4 animate-spin rounded-full border-[1.5px] border-brand-marfim/30 border-t-brand-marfim"
    />
  );
}
