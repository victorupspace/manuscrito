"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Icon } from "@/components/ui/icon";
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
  onDeleted,
}: {
  project: UserProject;
  index: number;
  onDeleted?: (projectId: string) => void;
}) {
  const router = useRouter();
  const iconName = PROJECT_TYPE_ICONS[project.type];
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
        onDeleted?.(project.id);
        setConfirmOpen(false);
        router.refresh();
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
        className="group rounded-md border border-border-subtle bg-surface-1 p-4 shadow-xs transition-all hover:border-border-default hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-brand-primary-soft text-brand-primary">
            <Icon name={iconName} opticalSize={24} className="text-[22px]" />
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              aria-label={`Mais opções para ${project.title}`}
              className="inline-flex size-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[state=open]:bg-surface-3 data-[state=open]:text-text-primary"
            >
              <Icon name="more_horiz" opticalSize={20} className="text-[20px]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setErrorMessage(null);
                  setConfirmOpen(true);
                }}
                className="cursor-pointer text-[0.9rem] text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Icon
                  name="delete"
                  opticalSize={20}
                  className="text-[18px]"
                />
                Excluir material
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-text-muted">
            {PROJECT_TYPE_LABELS[project.type]} · {statusLabel[project.status]}
          </p>
          <h3 className="mt-2 line-clamp-2 text-[1.05rem] font-bold leading-tight tracking-tight text-text-primary">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-[2.6rem] text-[0.88rem] leading-relaxed text-text-secondary">
            {project.description ||
              "Um espaço reservado para desenvolver este material com calma."}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
          <div className="text-[0.82rem] text-text-secondary">
            <span className="font-num font-bold text-text-primary">
              {numberFormatter.format(project.wordCount)}
            </span>{" "}
            palavras
          </div>
          <div className="inline-flex items-center gap-1.5 text-[0.78rem] text-text-muted">
            <Icon name="schedule" opticalSize={20} className="text-[14px]" />
            {updatedAt}
          </div>
        </div>

        <Link
          href={`/plataforma/escrita/${project.id}`}
          className="mt-4 inline-flex items-center gap-2 text-[0.88rem] font-bold text-brand-primary underline-offset-4 transition-colors hover:text-brand-primary-hover hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Continuar escrevendo
          <Icon name="north_east" opticalSize={20} className="text-[16px]" />
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
            <DialogTitle className="text-text-primary">
              Excluir “{project.title}”?
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              Esta ação é permanente. O material e tudo o que está dentro dele
              será removido. Suas tarefas associadas a este projeto permanecem
              salvas, mas perdem o vínculo.
            </DialogDescription>
          </DialogHeader>

          {errorMessage ? (
            <p
              role="alert"
              className="text-[0.85rem] leading-relaxed text-destructive"
            >
              {errorMessage}
            </p>
          ) : null}

          <DialogFooter>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
              className="inline-flex h-10 items-center justify-center rounded-md border border-border-default bg-surface-2 px-4 text-[0.88rem] text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              aria-busy={isPending || undefined}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-destructive px-4 text-[0.88rem] font-bold text-text-on-brand transition-colors",
                "hover:brightness-95 focus-visible:ring-2 focus-visible:ring-destructive/40 focus-visible:outline-none",
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
                  <Icon
                    name="delete"
                    opticalSize={20}
                    className="text-[18px]"
                  />
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
      className="inline-block h-4 w-4 animate-spin rounded-full border-[1.5px] border-text-on-brand/30 border-t-text-on-brand"
    />
  );
}
