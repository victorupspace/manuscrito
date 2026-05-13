"use client";

import { useState, useTransition } from "react";

import { Icon } from "@/components/ui/icon";
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
    <li className="rounded-md border border-border-subtle bg-surface-2 p-3 transition-colors hover:bg-surface-1">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          role="checkbox"
          aria-checked={task.completed}
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            task.completed
              ? "border-brand-primary bg-brand-primary text-text-on-brand"
              : "border-border-strong text-transparent hover:border-brand-primary",
          )}
        >
          <Icon name="check" opticalSize={20} className="text-[14px]" />
        </button>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-[0.94rem] leading-snug text-text-primary",
              task.completed && "text-text-muted line-through",
            )}
          >
            {task.title}
          </p>
          {task.description ? (
            <p className="mt-1 text-[0.82rem] leading-relaxed text-text-secondary">
              {task.description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-3 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Remover tarefa"
        >
          <Icon name="delete" opticalSize={20} className="text-[18px]" />
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-[0.8rem] text-destructive">
          {error}
        </p>
      ) : null}
    </li>
  );
}
