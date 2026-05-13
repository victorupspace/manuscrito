"use client";

import type { ReactNode } from "react";

import { MetricCard } from "@/components/platform/metric-card";
import type { PlatformOverview } from "@/types/platform";

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function OverviewMetrics({
  overview,
  error,
  children,
}: {
  overview: PlatformOverview;
  error?: string;
  children?: ReactNode;
}) {
  if (error) {
    return (
      <section className="rounded-md border border-destructive/30 bg-surface-muted p-4">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-destructive">
          Falha ao carregar métricas
        </p>
        <p className="mt-2 text-[0.9rem] text-text-secondary">{error}</p>
      </section>
    );
  }

  const cards = [
    {
      label: "Materiais ativos",
      value: overview.activeMaterials,
      helper: "projetos em andamento",
      icon: "library_books",
    },
    {
      label: "Palavras escritas",
      value: numberFormatter.format(overview.totalWords),
      helper: "em todos os seus materiais",
      icon: "text_fields",
    },
    {
      label: "Ritmo de escrita",
      value: `${overview.writingStreakDays} dias`,
      helper: "sequência preparada para cálculo futuro",
      icon: "local_fire_department",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <MetricCard key={card.label} {...card} index={index} />
      ))}
      {children}
    </section>
  );
}
