"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Icon } from "@/components/ui/icon";
import { TaskItem } from "@/components/platform/task-item";
import { createTaskAction } from "@/features/tasks/actions/create-task";
import {
  writingTaskCreateSchema,
  type WritingTaskCreateInput,
} from "@/lib/validations/writing-task";
import { cn } from "@/lib/utils";
import type { WritingTask } from "@/types/writing-task";

export function WritingTasksCard({
  initialTasks,
  error,
  className,
}: {
  initialTasks: WritingTask[];
  error?: string;
  className?: string;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WritingTaskCreateInput>({
    resolver: zodResolver(writingTaskCreateSchema),
    defaultValues: { title: "", description: null, projectId: null },
  });

  function submit(values: WritingTaskCreateInput) {
    setMessage(null);
    startTransition(async () => {
      const result = await createTaskAction(values);
      if (result.status === "error") {
        setMessage(result.message);
        return;
      }
      if (result.data) {
        setTasks((current) => [result.data!, ...current]);
      }
      reset({ title: "", description: null, projectId: null });
    });
  }

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <section
      className={cn(
        "rounded-lg border border-border-subtle bg-surface-1 p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 items-center justify-center rounded-md bg-brand-primary-soft text-brand-primary">
          <Icon name="checklist" opticalSize={24} className="text-[22px]" />
        </span>
        <div>
          <h2 className="text-[1.15rem] font-bold tracking-tight text-text-primary">
            Tarefas de escrita
          </h2>
          <p className="mt-1 text-[0.9rem] leading-relaxed text-text-secondary">
            Organize pequenos passos para manter seu projeto em movimento.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)} className="mt-5 space-y-2">
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor="task-title" className="sr-only">
              Nova tarefa
            </label>
            <input
              id="task-title"
              {...register("title")}
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? "task-title-error" : undefined}
              className="h-10 w-full rounded-md border border-border-default bg-surface-2 px-3 text-[0.92rem] text-text-primary outline-none placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Ex.: Revisar o primeiro capítulo"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-brand-primary px-3 text-[0.88rem] font-bold text-text-on-brand transition-colors hover:bg-brand-primary-hover disabled:opacity-55"
          >
            <Icon name="add" opticalSize={20} className="text-[18px]" />
            Adicionar
          </button>
        </div>
        {errors.title ? (
          <p
            id="task-title-error"
            role="alert"
            className="text-[0.8rem] text-destructive"
          >
            {errors.title.message}
          </p>
        ) : null}
        {message ? (
          <p role="alert" className="text-[0.8rem] text-destructive">
            {message}
          </p>
        ) : null}
      </form>

      {error ? (
        <div className="mt-5 rounded-md border border-destructive/30 bg-surface-2 p-4">
          <p className="text-[0.9rem] text-destructive">{error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="mt-5 rounded-md border border-dashed border-border-default bg-surface-2 p-5">
          <h3 className="text-[1rem] font-bold tracking-tight text-text-primary">
            Crie uma próxima ação.
          </h3>
          <p className="mt-1 text-[0.88rem] leading-relaxed text-text-secondary">
            Uma boa história avança melhor quando o próximo passo está claro.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Organizar personagens principais",
              "Definir conflito central",
              "Escrever 500 palavras hoje",
            ].map((suggestion) => (
              <span
                key={suggestion}
                className="rounded-full border border-border-subtle bg-surface-1 px-3 py-1 text-[0.78rem] text-text-secondary"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <ul className="space-y-2">
            {pendingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onChanged={(next) =>
                  setTasks((current) =>
                    current.map((item) => (item.id === next.id ? next : item)),
                  )
                }
                onDeleted={(taskId) =>
                  setTasks((current) =>
                    current.filter((item) => item.id !== taskId),
                  )
                }
              />
            ))}
          </ul>
          {completedTasks.length > 0 ? (
            <details className="group">
              <summary className="cursor-pointer text-[0.78rem] font-bold uppercase tracking-[0.14em] text-text-muted outline-none marker:text-brand-primary">
                Concluídas ({completedTasks.length})
              </summary>
              <ul className="mt-2 space-y-2">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onChanged={(next) =>
                      setTasks((current) =>
                        current.map((item) =>
                          item.id === next.id ? next : item,
                        ),
                      )
                    }
                    onDeleted={(taskId) =>
                      setTasks((current) =>
                        current.filter((item) => item.id !== taskId),
                      )
                    }
                  />
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      )}
    </section>
  );
}
