"use client";

import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";

import { Icon } from "@/components/ui/icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskItem } from "@/components/platform/task-item";
import { createTaskAction } from "@/features/tasks/actions/create-task";
import {
  writingTaskCreateSchema,
  type WritingTaskCreateInput,
} from "@/lib/validations/writing-task";
import type { WritingTask } from "@/types/writing-task";

export function TasksMetricCard({
  initialTasks,
  error,
  index = 3,
}: {
  initialTasks: WritingTask[];
  error?: string;
  index?: number;
}) {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const activeTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks],
  );
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks],
  );

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

  return (
    <>
      <motion.button
        type="button"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: index * 0.04 }}
        onClick={() => setOpen(true)}
        className="group rounded-md border border-border-subtle bg-surface-1 p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-border-default hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-text-muted">
            Tarefas
          </p>
          <span className="flex size-9 items-center justify-center rounded-md bg-brand-primary-soft text-brand-primary">
            <Icon name="checklist" opticalSize={20} className="text-[20px]" />
          </span>
        </div>
        <p className="font-num mt-4 text-[1.85rem] font-bold leading-none tracking-tight text-text-primary">
          {activeTasks.length}
        </p>
        <p className="mt-2 text-[0.85rem] leading-snug text-text-secondary">
          tarefas ativas
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-[0.84rem] font-bold text-brand-primary transition-colors group-hover:text-brand-primary-hover">
          Abrir tarefas
          <Icon name="arrow_forward" opticalSize={20} className="text-[18px]" />
        </span>
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(90dvh,760px)] max-w-[calc(100%-1.25rem)] overflow-y-auto rounded-xl border border-border-default bg-surface-elevated p-0 text-text-primary shadow-xl sm:max-w-2xl">
          <div className="border-b border-border-subtle bg-surface-1 px-5 py-5 sm:px-6">
            <DialogHeader>
              <DialogTitle className="text-[1.35rem] font-bold tracking-tight text-text-primary">
                Tarefas de escrita
              </DialogTitle>
              <DialogDescription className="text-[0.94rem] leading-relaxed text-text-secondary">
                Organize pequenos passos para manter seu projeto em movimento.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-5 py-5 sm:px-6">
            <form onSubmit={handleSubmit(submit)} className="space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <label htmlFor="task-title-modal" className="sr-only">
                    Nova tarefa
                  </label>
                  <input
                    id="task-title-modal"
                    {...register("title")}
                    aria-invalid={errors.title ? true : undefined}
                    aria-describedby={
                      errors.title ? "task-title-modal-error" : undefined
                    }
                    className="h-11 w-full rounded-md border border-border-default bg-surface-2 px-3 text-[0.94rem] text-text-primary outline-none placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Ex.: Revisar o primeiro capítulo"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-brand-primary px-4 text-[0.9rem] font-bold text-text-on-brand transition-colors hover:bg-brand-primary-hover disabled:opacity-55"
                >
                  <Icon name="add" opticalSize={20} className="text-[18px]" />
                  Adicionar
                </button>
              </div>
              {errors.title ? (
                <p
                  id="task-title-modal-error"
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
              {error ? (
                <p role="alert" className="text-[0.8rem] text-destructive">
                  {error}
                </p>
              ) : null}
            </form>

            <div className="mt-5">
              {tasks.length === 0 ? (
                <div className="rounded-md border border-dashed border-border-default bg-surface-2 p-5">
                  <h3 className="text-[1rem] font-bold tracking-tight text-text-primary">
                    Crie uma próxima ação.
                  </h3>
                  <p className="mt-1 text-[0.88rem] leading-relaxed text-text-secondary">
                    Uma boa história avança melhor quando o próximo passo está
                    claro.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-text-muted">
                      Ativas ({activeTasks.length})
                    </p>
                    {activeTasks.length > 0 ? (
                      <ul className="space-y-2">
                        {activeTasks.map((task) => (
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
                    ) : (
                      <p className="rounded-md border border-border-subtle bg-surface-2 p-4 text-[0.88rem] text-text-secondary">
                        Nenhuma tarefa ativa no momento.
                      </p>
                    )}
                  </div>

                  {completedTasks.length > 0 ? (
                    <details className="group">
                      <summary className="cursor-pointer text-[0.72rem] font-bold uppercase tracking-[0.16em] text-text-muted outline-none marker:text-brand-primary">
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
