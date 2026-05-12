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

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((project) => project.type === filter);
  }, [filter, projects]);

  return (
    <section id="materiais" className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-serif text-[0.7rem] uppercase tracking-[0.3em] text-brand-tinta/70">
            Biblioteca
          </p>
          <h2 className="mt-1 font-serif text-[1.7rem] italic text-brand-bordo">
            Seus materiais
          </h2>
          <p className="mt-1 font-serif text-[0.96rem] text-brand-tinta">
            Organize livros, contos e rascunhos em um só lugar.
          </p>
        </div>

        <div className="flex overflow-x-auto rounded-md border border-brand-bordo/10 bg-brand-creme/60 p-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "h-9 shrink-0 rounded-sm px-3 font-serif text-[0.86rem] transition-colors focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none",
                filter === item.id
                  ? "bg-brand-bordo text-brand-marfim"
                  : "text-brand-tinta hover:bg-brand-marfim hover:text-brand-bordo",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-brand-bordo/20 bg-brand-creme/60 p-5">
          <p className="font-serif text-[0.78rem] uppercase tracking-[0.24em] text-brand-bordo">
            Falha ao carregar materiais
          </p>
          <p className="mt-2 font-serif text-[0.95rem] text-brand-tinta">
            {error}
          </p>
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
            <MaterialCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
