"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListChecks, Plus } from "lucide-react";
import { useForm } from "react-hook-form";

import { TaskItem } from "@/components/platform/task-item";
import { createTaskAction } from "@/features/tasks/actions/create-task";
import {
  writingTaskCreateSchema,
  type WritingTaskCreateInput,
} from "@/lib/validations/writing-task";
import type { WritingTask } from "@/types/writing-task";

export function WritingTasksCard({
  initialTasks,
  error,
}: {
  initialTasks: WritingTask[];
  error?: string;
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
    <section className="rounded-lg border border-brand-bordo/10 bg-brand-creme/55 p-5 shadow-[0_24px_70px_-56px_rgba(31,27,22,0.55)]">
      <div className="flex items-start gap-3">
        <span className="flex size-10 items-center justify-center rounded-md bg-brand-marfim text-brand-bordo">
          <ListChecks className="size-5" />
        </span>
        <div>
          <h2 className="font-serif text-[1.35rem] italic text-brand-bordo">
            Tarefas de escrita
          </h2>
          <p className="mt-1 font-serif text-[0.92rem] leading-relaxed text-brand-tinta">
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
              className="h-10 w-full rounded-md border border-brand-bordo/15 bg-brand-marfim px-3 font-serif text-[0.92rem] text-brand-carvao outline-none placeholder:text-brand-tinta/40 focus-visible:border-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/25"
              placeholder="Ex.: Revisar o primeiro capítulo"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-brand-bordo bg-brand-bordo px-3 font-serif text-[0.88rem] text-brand-marfim transition-colors hover:bg-brand-bordo-profundo disabled:opacity-55"
          >
            <Plus className="size-4" />
            Adicionar
          </button>
        </div>
        {errors.title ? (
          <p
            id="task-title-error"
            role="alert"
            className="font-serif text-[0.8rem] italic text-brand-bordo"
          >
            {errors.title.message}
          </p>
        ) : null}
        {message ? (
          <p
            role="alert"
            className="font-serif text-[0.8rem] italic text-brand-bordo"
          >
            {message}
          </p>
        ) : null}
      </form>

      {error ? (
        <div className="mt-5 rounded-md border border-brand-bordo/20 bg-brand-marfim p-4">
          <p className="font-serif text-[0.9rem] text-brand-bordo">{error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="mt-5 rounded-md border border-dashed border-brand-bordo/25 bg-brand-marfim/65 p-5">
          <h3 className="font-serif text-[1.1rem] italic text-brand-bordo">
            Crie uma próxima ação.
          </h3>
          <p className="mt-1 font-serif text-[0.9rem] leading-relaxed text-brand-tinta">
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
                className="rounded-full border border-brand-bordo/10 bg-brand-creme px-3 py-1 font-serif text-[0.78rem] text-brand-tinta"
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
              <summary className="cursor-pointer font-serif text-[0.82rem] uppercase tracking-[0.22em] text-brand-tinta/75 outline-none marker:text-brand-bordo">
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
