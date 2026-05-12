"use client";

import {
  BookOpen,
  Feather,
  FileText,
  Flame,
  LibraryBig,
  Type,
} from "lucide-react";

import { MetricCard } from "@/components/platform/metric-card";
import type { PlatformOverview } from "@/types/platform";

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function OverviewMetrics({
  overview,
  error,
}: {
  overview: PlatformOverview;
  error?: string;
}) {
  if (error) {
    return (
      <section className="rounded-md border border-brand-bordo/20 bg-brand-creme/60 p-4">
        <p className="font-serif text-[0.78rem] uppercase tracking-[0.24em] text-brand-bordo">
          Falha ao carregar métricas
        </p>
        <p className="mt-2 font-serif text-[0.92rem] text-brand-tinta">
          {error}
        </p>
      </section>
    );
  }

  const cards = [
    {
      label: "Palavras escritas",
      value: numberFormatter.format(overview.totalWords),
      helper: "em todos os seus materiais",
      icon: Type,
    },
    {
      label: "Materiais ativos",
      value: overview.activeMaterials,
      helper: "projetos em andamento",
      icon: LibraryBig,
    },
    {
      label: "Livros",
      value: overview.projectCounts.book,
      helper: "projetos longos",
      icon: BookOpen,
    },
    {
      label: "Contos",
      value: overview.projectCounts.short_story,
      helper: "narrativas curtas",
      icon: Feather,
    },
    {
      label: "Rascunhos",
      value: overview.projectCounts.draft,
      helper: "ideias em formação",
      icon: FileText,
    },
    {
      label: "Ritmo de escrita",
      value: `${overview.writingStreakDays} dias`,
      helper: "sequência preparada para cálculo futuro",
      icon: Flame,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card, index) => (
        <MetricCard key={card.label} {...card} index={index} />
      ))}
    </section>
  );
}
