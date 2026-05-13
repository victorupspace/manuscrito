"use client";

import { useMemo, useState, useTransition } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { CorkboardCard } from "@/components/writing/corkboard-card";
import { CorkboardFilters } from "@/components/writing/corkboard-filters";
import { updateCorkboardOrderAction } from "@/features/writing/actions/update-corkboard-order";
import type { DocumentNodeType } from "@/constants/document-node-types";
import type {
  DocumentStatus,
  WritingDocumentNode,
  WritingProject,
} from "@/types/writing";

function SortableCorkboardCard({
  project,
  node,
}: {
  project: WritingProject;
  node: WritingDocumentNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <CorkboardCard
        project={project}
        node={node}
        dragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function CorkboardView({
  project,
  nodes,
}: {
  project: WritingProject;
  nodes: WritingDocumentNode[];
}) {
  const [orderedNodes, setOrderedNodes] = useState(nodes);
  const [typeFilter, setTypeFilter] = useState<"all" | DocumentNodeType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | DocumentStatus>(
    "all",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const visibleNodes = useMemo(
    () =>
      orderedNodes.filter((node) => {
        const matchesType = typeFilter === "all" || node.type === typeFilter;
        const matchesStatus =
          statusFilter === "all" || node.status === statusFilter;
        return matchesType && matchesStatus && node.status !== "archived";
      }),
    [orderedNodes, statusFilter, typeFilter],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedNodes.findIndex((node) => node.id === active.id);
    const newIndex = orderedNodes.findIndex((node) => node.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const nextNodes = arrayMove(orderedNodes, oldIndex, newIndex).map(
      (node, index) => ({ ...node, orderIndex: index }),
    );

    setOrderedNodes(nextNodes);
    setMessage(null);
    startTransition(async () => {
      const result = await updateCorkboardOrderAction({
        projectId: project.id,
        orderedNodeIds: nextNodes.map((node) => node.id),
      });
      if (result.status === "error") setMessage(result.message);
    });
  }

  return (
    <section className="min-h-[calc(100dvh-122px)] bg-brand-marfim p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-tinta/65">
              Quadro
            </p>
            <h2 className="mt-1 font-serif text-[2rem] italic text-brand-bordo">
              Cards narrativos
            </h2>
            <p className="mt-2 max-w-2xl font-serif text-[0.98rem] leading-relaxed text-brand-tinta">
              Visualize capítulos, cenas e notas como peças móveis da sua
              narrativa.
            </p>
          </div>
          {pending ? (
            <p className="font-serif text-[0.82rem] italic text-brand-tinta">
              Salvando nova ordem...
            </p>
          ) : null}
        </div>

        <div className="mt-6">
          <CorkboardFilters
            type={typeFilter}
            status={statusFilter}
            onTypeChange={setTypeFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {message ? (
          <p className="mt-4 font-serif text-[0.85rem] text-red-700">
            {message}
          </p>
        ) : null}

        {visibleNodes.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-brand-bordo/20 bg-brand-creme/65 p-8 text-center">
            <h3 className="font-serif text-[1.4rem] italic text-brand-bordo">
              Nenhum card neste filtro.
            </h3>
            <p className="mt-2 font-serif text-brand-tinta">
              Ajuste os filtros ou crie uma nova cena na estrutura.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleNodes.map((node) => node.id)}
              strategy={rectSortingStrategy}
            >
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleNodes.map((node) => (
                  <SortableCorkboardCard
                    key={node.id}
                    project={project}
                    node={node}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </section>
  );
}
