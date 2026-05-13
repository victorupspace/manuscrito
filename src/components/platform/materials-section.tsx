"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/platform/empty-state";
import { MaterialCard } from "@/components/platform/material-card";
import {
  PROJECT_TYPE_LABELS,
  type ProjectType,
} from "@/constants/project-types";
import type { UserProject } from "@/types/project";
import { cn } from "@/lib/utils";

type Filter = "all" | ProjectType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "book", label: "Livros" },
  { id: "short_story", label: "Contos" },
  { id: "draft", label: "Rascunhos" },
];

export function MaterialsSection({
  projects,
  error,
}: {
  projects: UserProject[];
  error?: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [deletedProjectIds, setDeletedProjectIds] = useState<Set<string>>(
    () => new Set(),
  );

  const filteredProjects = useMemo(() => {
    const visibleProjects = projects.filter(
      (project) => !deletedProjectIds.has(project.id),
    );

    if (filter === "all") return visibleProjects;
    return visibleProjects.filter((project) => project.type === filter);
  }, [deletedProjectIds, filter, projects]);

  function handleDeleted(projectId: string) {
    setDeletedProjectIds((current) => {
      const next = new Set(current);
      next.add(projectId);
      return next;
    });
  }

  return (
    <section id="materiais" className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-text-muted">
            Biblioteca
          </p>
          <h2 className="mt-1 text-[1.5rem] font-bold tracking-tight text-text-primary">
            Seus materiais
          </h2>
          <p className="mt-1 text-[0.94rem] text-text-secondary">
            Organize livros, contos e rascunhos em um só lugar.
          </p>
        </div>

        <div className="flex overflow-x-auto rounded-md border border-border-subtle bg-surface-2 p-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "h-9 shrink-0 rounded-sm px-3 text-[0.85rem] transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                filter === item.id
                  ? "bg-brand-primary font-bold text-text-on-brand"
                  : "text-text-secondary hover:bg-surface-1 hover:text-text-primary",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-surface-muted p-5">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-destructive">
            Falha ao carregar materiais
          </p>
          <p className="mt-2 text-[0.92rem] text-text-secondary">{error}</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title={
            filter === "all"
              ? "Seu primeiro projeto começa aqui."
              : `Nenhum ${PROJECT_TYPE_LABELS[filter].toLowerCase()} por enquanto.`
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <MaterialCard
              key={project.id}
              project={project}
              index={index}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </section>
  );
}
