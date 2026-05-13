"use client";

import { useMemo, useState, useTransition } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { BinderItem } from "@/components/writing/binder-item";
import { updateDocumentNodeOrderAction } from "@/features/writing/actions/update-document-node-order";
import type { WritingDocumentNode, WritingProject } from "@/types/writing";

type TreeNode = WritingDocumentNode & { children: TreeNode[]; depth: number };

function buildTree(nodes: WritingDocumentNode[]): TreeNode[] {
  const byId = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  nodes
    .slice()
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .forEach((node) => {
      byId.set(node.id, { ...node, children: [], depth: 0 });
    });

  byId.forEach((node) => {
    if (node.parentId && byId.has(node.parentId)) {
      const parent = byId.get(node.parentId);
      if (parent) {
        node.depth = parent.depth + 1;
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function flattenTree(nodes: TreeNode[]): TreeNode[] {
  return nodes.flatMap((node) => [node, ...flattenTree(node.children)]);
}

function SortableBinderItem({
  project,
  node,
  activeNodeId,
}: {
  project: WritingProject;
  node: TreeNode;
  activeNodeId: string;
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
      <BinderItem
        project={project}
        node={node}
        depth={node.depth}
        active={node.id === activeNodeId}
        dragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function BinderTree({
  project,
  nodes,
  activeNodeId,
}: {
  project: WritingProject;
  nodes: WritingDocumentNode[];
  activeNodeId: string;
}) {
  const [orderedNodes, setOrderedNodes] = useState(nodes);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const flattenedNodes = useMemo(
    () => flattenTree(buildTree(orderedNodes)),
    [orderedNodes],
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = flattenedNodes.findIndex((node) => node.id === active.id);
    const newIndex = flattenedNodes.findIndex((node) => node.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const nextNodes = arrayMove(flattenedNodes, oldIndex, newIndex).map(
      (node, index) => ({ ...node, orderIndex: index }),
    );

    setOrderedNodes(nextNodes);
    setMessage(null);
    startTransition(async () => {
      const result = await updateDocumentNodeOrderAction({
        projectId: project.id,
        orderedNodeIds: nextNodes.map((node) => node.id),
      });
      if (result.status === "error") {
        setMessage(result.message);
      }
    });
  }

  if (flattenedNodes.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-brand-bordo/25 bg-brand-marfim p-4">
        <p className="font-serif text-[0.92rem] italic text-brand-tinta">
          Crie o primeiro capítulo, cena ou nota para começar a moldar a
          estrutura.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={flattenedNodes.map((node) => node.id)}
          strategy={verticalListSortingStrategy}
        >
          {flattenedNodes.map((node) => (
            <SortableBinderItem
              key={node.id}
              project={project}
              node={node}
              activeNodeId={activeNodeId}
            />
          ))}
        </SortableContext>
      </DndContext>
      {pending ? (
        <p className="font-serif text-[0.76rem] italic text-brand-tinta">
          Salvando ordem...
        </p>
      ) : null}
      {message ? (
        <p className="font-serif text-[0.76rem] italic text-red-700">
          {message}
        </p>
      ) : null}
    </div>
  );
}
