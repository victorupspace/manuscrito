"use client";

import { useState, useTransition } from "react";
import { Check, Trash2 } from "lucide-react";

import { deleteTaskAction } from "@/features/tasks/actions/delete-task";
import { toggleTaskAction } from "@/features/tasks/actions/toggle-task";
import { cn } from "@/lib/utils";
import type { WritingTask } from "@/types/writing-task";

export function TaskItem({
  task,
  onChanged,
  onDeleted,
}: {
  task: WritingTask;
  onChanged: (task: WritingTask) => void;
  onDeleted: (taskId: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    const next = { ...task, completed: !task.completed };
    onChanged(next);
    setError(null);
    startTransition(async () => {
      const result = await toggleTaskAction(task.id, next.completed);
      if (result.status === "error") {
        onChanged(task);
        setError(result.message);
      }
    });
  }

  function remove() {
    setError(null);
    startTransition(async () => {
      const result = await deleteTaskAction(task.id);
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      onDeleted(task.id);
    });
  }

  return (
    <li className="rounded-md border border-brand-bordo/10 bg-brand-marfim p-3">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          role="checkbox"
          aria-checked={task.completed}
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border transition-colors focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none",
            task.completed
              ? "border-brand-bordo bg-brand-bordo text-brand-marfim"
              : "border-brand-bordo/25 text-transparent hover:border-brand-bordo",
          )}
        >
          <Check className="size-3.5" />
        </button>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-serif text-[0.96rem] leading-snug text-brand-carvao",
              task.completed && "text-brand-tinta line-through",
            )}
          >
            {task.title}
          </p>
          {task.description ? (
            <p className="mt-1 font-serif text-[0.82rem] leading-relaxed text-brand-tinta">
              {task.description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-brand-cinza transition-colors hover:bg-brand-creme hover:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none"
          aria-label="Remover tarefa"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      {error ? (
        <p
          role="alert"
          className="mt-2 font-serif text-[0.8rem] italic text-brand-bordo"
        >
          {error}
        </p>
      ) : null}
    </li>
  );
}
