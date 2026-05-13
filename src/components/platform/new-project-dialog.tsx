"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";

import { Icon } from "@/components/ui/icon";
import { ProjectTypeCard } from "@/components/platform/project-type-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PROJECT_TYPE_DESCRIPTIONS,
  PROJECT_TYPE_ICONS,
  PROJECT_TYPE_LABELS,
  PROJECT_TYPE_OPTIONS,
  type ProjectType,
} from "@/constants/project-types";
import { createProjectAction } from "@/features/projects/actions/create-project";
import {
  projectCreateSchema,
  type ProjectCreateInput,
} from "@/lib/validations/project-create";
import { cn } from "@/lib/utils";

type Step = "type" | "details";

export function NewProjectDialog({
  triggerClassName,
}: {
  triggerClassName?: string;
}) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("type");
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectCreateInput>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: {
      type: "draft",
      title: "",
      description: null,
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setStep("type");
      setSelectedType(null);
      setMessage(null);
      reset({ type: "draft", title: "", description: null });
    }
  }

  function selectType(type: ProjectType) {
    setSelectedType(type);
    setValue("type", type, { shouldValidate: true });
    setMessage(null);
    setStep("details");
  }

  function submit(values: ProjectCreateInput) {
    setMessage(null);
    startTransition(async () => {
      const result = await createProjectAction(values);
      if (result.status === "error") {
        setMessage({ type: "error", text: result.message });
        return;
      }

      setMessage({ type: "success", text: "Projeto criado." });
      router.refresh();
      window.setTimeout(() => setOpen(false), 450);
    });
  }

  const selectedIconName = selectedType
    ? PROJECT_TYPE_ICONS[selectedType]
    : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-primary px-4 text-[0.9rem] font-bold text-text-on-brand shadow-sm transition-colors hover:bg-brand-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 focus-visible:outline-none",
          triggerClassName,
        )}
      >
        <Icon name="add" opticalSize={20} className="text-[18px]" />
        Novo projeto
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[min(90dvh,760px)] max-w-[calc(100%-1.25rem)] overflow-y-auto rounded-xl border border-border-default bg-surface-elevated p-0 text-text-primary shadow-xl sm:max-w-2xl">
          <div className="border-b border-border-subtle bg-surface-1 px-5 py-5 sm:px-6">
            <DialogHeader>
              <DialogTitle className="text-[1.4rem] font-bold tracking-tight text-text-primary">
                {step === "type"
                  ? "O que você quer começar?"
                  : "Dê um nome ao seu projeto."}
              </DialogTitle>
              <DialogDescription className="text-[0.94rem] leading-relaxed text-text-secondary">
                {step === "type"
                  ? "Escolha o tipo de material para estruturar sua próxima ideia."
                  : "Esse nome poderá ser alterado depois."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-5 py-5 sm:px-6">
            <AnimatePresence mode="wait" initial={false}>
              {step === "type" ? (
                <motion.div
                  key="type"
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                  className="grid gap-3"
                >
                  {PROJECT_TYPE_OPTIONS.map((option) => (
                    <ProjectTypeCard
                      key={option.id}
                      type={option.id}
                      label={option.label}
                      description={option.description}
                      icon={option.icon}
                      selected={selectedType === option.id}
                      onSelect={selectType}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.form
                  key="details"
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                  onSubmit={handleSubmit(submit)}
                  className="space-y-5"
                >
                  {selectedType && selectedIconName ? (
                    <div className="flex items-start gap-3 rounded-md border border-border-subtle bg-surface-1 p-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-primary-soft text-brand-primary">
                        <Icon
                          name={selectedIconName}
                          opticalSize={24}
                          className="text-[22px]"
                        />
                      </span>
                      <div>
                        <p className="text-[0.98rem] font-bold tracking-tight text-text-primary">
                          {PROJECT_TYPE_LABELS[selectedType]}
                        </p>
                        <p className="mt-1 text-[0.85rem] leading-relaxed text-text-secondary">
                          {PROJECT_TYPE_DESCRIPTIONS[selectedType]}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <input type="hidden" {...register("type")} />

                  <div className="space-y-1.5">
                    <label
                      htmlFor="project-title"
                      className="block text-[0.72rem] font-bold uppercase tracking-[0.16em] text-text-muted"
                    >
                      Nome do projeto
                    </label>
                    <input
                      id="project-title"
                      {...register("title")}
                      aria-invalid={errors.title ? true : undefined}
                      aria-describedby={
                        errors.title ? "project-title-error" : undefined
                      }
                      className="h-11 w-full rounded-md border border-border-default bg-surface-2 px-3 text-[0.98rem] text-text-primary outline-none placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Ex.: A casa no fim da rua"
                    />
                    {errors.title ? (
                      <p
                        id="project-title-error"
                        role="alert"
                        className="text-[0.82rem] text-destructive"
                      >
                        {errors.title.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="project-description"
                      className="block text-[0.72rem] font-bold uppercase tracking-[0.16em] text-text-muted"
                    >
                      Breve descrição
                    </label>
                    <textarea
                      id="project-description"
                      {...register("description")}
                      aria-invalid={errors.description ? true : undefined}
                      className="min-h-24 w-full resize-none rounded-md border border-border-default bg-surface-2 px-3 py-2.5 text-[0.96rem] leading-relaxed text-text-primary outline-none placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Uma frase para lembrar o centro da ideia."
                    />
                  </div>

                  {message ? (
                    <p
                      role={message.type === "error" ? "alert" : "status"}
                      className={cn(
                        "text-[0.86rem]",
                        message.type === "error"
                          ? "text-destructive"
                          : "text-text-secondary",
                      )}
                    >
                      {message.text}
                    </p>
                  ) : null}

                  <div className="flex flex-col-reverse gap-2 border-t border-border-subtle pt-4 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setStep("type")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-default px-4 text-[0.9rem] text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <Icon
                        name="arrow_back"
                        opticalSize={20}
                        className="text-[18px]"
                      />
                      Trocar tipo
                    </button>
                    <button
                      type="submit"
                      disabled={pending}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-brand-primary px-5 text-[0.92rem] font-bold text-text-on-brand transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {pending ? "Criando..." : "Criar projeto"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
