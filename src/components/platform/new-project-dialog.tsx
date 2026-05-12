"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import { useForm } from "react-hook-form";

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

  const SelectedIcon = selectedType ? PROJECT_TYPE_ICONS[selectedType] : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-brand-bordo bg-brand-bordo px-4 font-serif text-[0.92rem] text-brand-marfim shadow-sm transition-colors hover:bg-brand-bordo-profundo focus-visible:ring-2 focus-visible:ring-brand-bordo/35 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-marfim focus-visible:outline-none",
          triggerClassName,
        )}
      >
        <Plus className="size-4" />
        Novo projeto
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[min(90dvh,760px)] max-w-[calc(100%-1.25rem)] overflow-y-auto rounded-xl border border-brand-bordo/15 bg-brand-marfim p-0 text-brand-carvao shadow-2xl sm:max-w-2xl">
          <div className="border-b border-brand-bordo/10 bg-brand-creme/60 px-5 py-5 sm:px-6">
            <DialogHeader>
              <DialogTitle className="font-serif text-[1.65rem] italic text-brand-bordo">
                {step === "type"
                  ? "O que você quer começar?"
                  : "Dê um nome ao seu projeto."}
              </DialogTitle>
              <DialogDescription className="font-serif text-[0.95rem] leading-relaxed text-brand-tinta">
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
                  {selectedType && SelectedIcon ? (
                    <div className="flex items-start gap-3 rounded-md border border-brand-bordo/10 bg-brand-creme/55 p-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-marfim text-brand-bordo">
                        <SelectedIcon className="size-5" />
                      </span>
                      <div>
                        <p className="font-serif text-[1rem] italic text-brand-carvao">
                          {PROJECT_TYPE_LABELS[selectedType]}
                        </p>
                        <p className="mt-1 font-serif text-[0.85rem] leading-relaxed text-brand-tinta">
                          {PROJECT_TYPE_DESCRIPTIONS[selectedType]}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <input type="hidden" {...register("type")} />

                  <div className="space-y-1.5">
                    <label
                      htmlFor="project-title"
                      className="font-serif text-[0.7rem] uppercase tracking-[0.26em] text-brand-tinta/75"
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
                      className="h-11 w-full rounded-md border border-brand-bordo/18 bg-brand-marfim px-3 font-serif text-[1rem] text-brand-carvao outline-none placeholder:text-brand-tinta/40 focus-visible:border-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/25"
                      placeholder="Ex.: A casa no fim da rua"
                    />
                    {errors.title ? (
                      <p
                        id="project-title-error"
                        role="alert"
                        className="font-serif text-[0.82rem] italic text-brand-bordo"
                      >
                        {errors.title.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="project-description"
                      className="font-serif text-[0.7rem] uppercase tracking-[0.26em] text-brand-tinta/75"
                    >
                      Breve descrição
                    </label>
                    <textarea
                      id="project-description"
                      {...register("description")}
                      aria-invalid={errors.description ? true : undefined}
                      className="min-h-24 w-full resize-none rounded-md border border-brand-bordo/18 bg-brand-marfim px-3 py-2.5 font-serif text-[0.98rem] leading-relaxed text-brand-carvao outline-none placeholder:text-brand-tinta/40 focus-visible:border-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/25"
                      placeholder="Uma frase para lembrar o centro da ideia."
                    />
                  </div>

                  {message ? (
                    <p
                      role={message.type === "error" ? "alert" : "status"}
                      className={cn(
                        "font-serif text-[0.86rem] italic",
                        message.type === "error"
                          ? "text-brand-bordo"
                          : "text-brand-tinta",
                      )}
                    >
                      {message.text}
                    </p>
                  ) : null}

                  <div className="flex flex-col-reverse gap-2 border-t border-brand-bordo/10 pt-4 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setStep("type")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-brand-bordo/15 px-4 font-serif text-[0.92rem] text-brand-tinta transition-colors hover:bg-brand-creme hover:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none"
                    >
                      <ArrowLeft className="size-4" />
                      Trocar tipo
                    </button>
                    <button
                      type="submit"
                      disabled={pending}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-brand-bordo bg-brand-bordo px-5 font-serif text-[0.95rem] text-brand-marfim transition-colors hover:bg-brand-bordo-profundo disabled:cursor-not-allowed disabled:opacity-55"
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
