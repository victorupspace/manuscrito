"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { OutlinerMobileCard } from "@/components/writing/outliner-mobile-card";
import { OutlinerRow } from "@/components/writing/outliner-row";
import { CorkboardFilters } from "@/components/writing/corkboard-filters";
import type { DocumentNodeType } from "@/constants/document-node-types";
import type {
  DocumentStatus,
  WritingDocumentNode,
  WritingProject,
} from "@/types/writing";

export function OutlinerView({
  project,
  nodes,
}: {
  project: WritingProject;
  nodes: WritingDocumentNode[];
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | DocumentNodeType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | DocumentStatus>(
    "all",
  );
  const visibleNodes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return nodes.filter((node) => {
      const matchesType = typeFilter === "all" || node.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || node.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        node.title.toLowerCase().includes(normalizedQuery) ||
        (node.synopsis ?? "").toLowerCase().includes(normalizedQuery);

      return matchesType && matchesStatus && matchesQuery;
    });
  }, [nodes, query, statusFilter, typeFilter]);

  return (
    <section className="min-h-[calc(100dvh-122px)] bg-brand-marfim p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-tinta/65">
            Outline
          </p>
          <h2 className="mt-1 font-serif text-[2rem] italic text-brand-bordo">
            Visão estrutural
          </h2>
          <p className="mt-2 max-w-2xl font-serif text-[0.98rem] leading-relaxed text-brand-tinta">
            Planeje a obra por status, metas, sinopse, ponto de vista e
            posição narrativa.
          </p>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_22rem]">
          <CorkboardFilters
            type={typeFilter}
            status={statusFilter}
            onTypeChange={setTypeFilter}
            onStatusChange={setStatusFilter}
          />
          <label className="relative block">
            <span className="sr-only">Buscar por título ou sinopse</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-tinta/55" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 w-full rounded-md border border-brand-bordo/12 bg-brand-marfim pr-3 pl-9 font-serif text-[0.88rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/20"
              placeholder="Buscar na estrutura"
            />
          </label>
        </div>

        <div className="mt-6 hidden overflow-x-auto rounded-lg border border-brand-bordo/12 bg-white/45 lg:block">
          <table className="w-full border-collapse text-left">
            <thead className="bg-brand-creme/75">
              <tr className="font-serif text-[0.68rem] uppercase tracking-[0.18em] text-brand-tinta/70">
                <th className="px-3 py-3">Ordem</th>
                <th className="px-3 py-3">Título</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Sinopse</th>
                <th className="px-3 py-3">Palavras</th>
                <th className="px-3 py-3">Meta</th>
                <th className="px-3 py-3">Progresso</th>
                <th className="px-3 py-3">POV</th>
                <th className="px-3 py-3">Local</th>
                <th className="px-3 py-3">Tags</th>
                <th className="px-3 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {visibleNodes.map((node, index) => (
                <OutlinerRow
                  key={node.id}
                  project={project}
                  node={node}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 lg:hidden">
          {visibleNodes.map((node) => (
            <OutlinerMobileCard key={node.id} project={project} node={node} />
          ))}
        </div>

        {visibleNodes.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-brand-bordo/20 bg-brand-creme/65 p-8 text-center">
            <h3 className="font-serif text-[1.4rem] italic text-brand-bordo">
              Nada encontrado.
            </h3>
            <p className="mt-2 font-serif text-brand-tinta">
              Tente outro filtro ou busque por uma palavra do título.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
