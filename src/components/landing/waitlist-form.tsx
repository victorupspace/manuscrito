"use client";

import { forwardRef, useId, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Icon } from "@/components/ui/icon";
import { submitWaitlist } from "@/features/waitlist/actions/submit-waitlist";
import {
  formatBrazilianPhone,
  waitlistSchema,
  type WaitlistInput,
} from "@/lib/validations/waitlist";
import { cn } from "@/lib/utils";

type WaitlistFormProps = {
  onSuccess: () => void;
};

/**
 * Formulário de cadastro da landing.
 *
 * Paleta: todo o conteúdo vive sobre o card vinho (`brand-glass`), então
 * tudo é creme/marfim para garantir contraste WCAG AA sobre o fundo
 * escuro. O CTA inverte (fundo creme + texto vinho) e no hover vira o
 * vinho profundo com texto creme.
 */
export function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const baseId = useId();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<WaitlistInput>({
    resolver: zodResolver(waitlistSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: WaitlistInput) {
    setServerError(null);
    const result = await submitWaitlist(values);
    if (result.status === "ok") {
      onSuccess();
      return;
    }
    setServerError(result.message);
  }

  const isDisabled = isSubmitting || !isValid;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
      aria-describedby={serverError ? `${baseId}-server-error` : undefined}
    >
      <header className="text-center">
        <h2 className="text-[1.6rem] font-bold leading-tight tracking-tight text-brand-marfim sm:text-[1.85rem]">
          Crie sua conta
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[0.93rem] leading-relaxed text-brand-marfim/80">
          Cadastre-se para começar a organizar seus projetos de escrita no
          Manuscrito.
        </p>
      </header>

      <Field
        id={`${baseId}-fullName`}
        label="Nome completo"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <Field
            id={`${baseId}-phone`}
            label="Telefone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="(11) 90000-0000"
            maxLength={15}
            name={field.name}
            ref={field.ref}
            value={field.value}
            error={errors.phone?.message}
            onBlur={field.onBlur}
            onChange={(event) => {
              field.onChange(formatBrazilianPhone(event.target.value));
            }}
          />
        )}
      />

      <Field
        id={`${baseId}-email`}
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordField
        id={`${baseId}-password`}
        label="Senha"
        hint="Mínimo de 8 caracteres."
        error={errors.password?.message}
        registration={register("password")}
      />

      <PasswordField
        id={`${baseId}-confirmPassword`}
        label="Repita sua senha"
        error={errors.confirmPassword?.message}
        registration={register("confirmPassword")}
      />

      {serverError ? (
        <p
          id={`${baseId}-server-error`}
          role="alert"
          className="rounded-md border border-brand-marfim/30 bg-brand-marfim/10 px-3 py-2 text-[0.86rem] text-brand-marfim"
        >
          <span
            aria-hidden
            className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-marfim align-middle"
          />
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={isSubmitting || undefined}
        className={cn(
          "group relative mt-1 inline-flex items-center justify-center gap-3 rounded-md bg-brand-marfim px-6 py-3.5 text-[0.95rem] font-bold text-brand-bordo shadow-sm transition-all duration-200 outline-none",
          "hover:bg-brand-bordo-profundo hover:text-brand-marfim focus-visible:ring-2 focus-visible:ring-brand-marfim/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo",
          "disabled:cursor-not-allowed disabled:bg-brand-marfim/30 disabled:text-brand-marfim/55 disabled:hover:bg-brand-marfim/30 disabled:hover:text-brand-marfim/55",
          "active:translate-y-px",
        )}
      >
        {isSubmitting ? (
          <>
            <Spinner />
            <span>Enviando…</span>
          </>
        ) : (
          <>
            <span>Criar conta</span>
            <Icon
              name="arrow_forward"
              opticalSize={20}
              className="text-[18px] transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </>
        )}
      </button>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brand-marfim/70">
          Cadastro beta · Volume I
        </p>
        <p className="text-[0.72rem] leading-snug text-brand-marfim/65">
          Seus dados são tratados com sigilo e criptografia, conforme a LGPD.
        </p>
      </div>
    </form>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Campo de formulário — label em versalete creme, input com bg suave.        */

type FieldProps = Omit<React.ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  leadingIcon?: React.ReactNode;
  trailingAdornment?: React.ReactNode;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  {
    id,
    label,
    error,
    hint,
    className,
    leadingIcon,
    trailingAdornment,
    ...inputProps
  },
  ref,
) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-brand-marfim/80"
      >
        {label}
      </label>
      <div
        className={cn(
          "group/field flex min-h-11 items-center gap-2 rounded-md border border-brand-marfim/25 bg-brand-marfim/95 px-3 transition-colors",
          "focus-within:border-brand-marfim focus-within:bg-brand-marfim focus-within:ring-2 focus-within:ring-brand-marfim/35",
          error
            ? "border-brand-marfim/70 bg-brand-marfim ring-2 ring-brand-marfim/30"
            : "",
        )}
      >
        {leadingIcon ? (
          <span className="flex shrink-0 items-center text-brand-tinta/70 transition-colors group-focus-within/field:text-brand-bordo">
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 text-[1rem] text-brand-carvao placeholder:text-brand-tinta/55 outline-none",
            "focus:ring-0",
            className,
          )}
          {...inputProps}
        />
        {trailingAdornment ? (
          <span className="flex shrink-0 items-center">
            {trailingAdornment}
          </span>
        ) : null}
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-0.5 flex items-center gap-2 text-[0.8rem] text-brand-marfim"
        >
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-brand-marfim"
          />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-0.5 text-[0.78rem] text-brand-marfim/70">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

/**
 * Campo de senha autocontido: gerencia o próprio estado de visibilidade
 * (toggle do olho) para isolar o re-render dos demais campos do formulário.
 */
function PasswordField({
  id,
  label,
  hint,
  error,
  registration,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  registration: UseFormRegisterReturn;
}) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-brand-marfim/80"
      >
        {label}
      </label>
      <div
        className={cn(
          "group/field flex min-h-11 items-center gap-2 rounded-md border border-brand-marfim/25 bg-brand-marfim/95 px-3 transition-colors",
          "focus-within:border-brand-marfim focus-within:bg-brand-marfim focus-within:ring-2 focus-within:ring-brand-marfim/35",
          error
            ? "border-brand-marfim/70 bg-brand-marfim ring-2 ring-brand-marfim/30"
            : "",
        )}
      >
        <span className="flex shrink-0 items-center text-brand-tinta/70 transition-colors group-focus-within/field:text-brand-bordo">
          <Icon name="lock" opticalSize={20} className="text-[18px]" />
        </span>
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 text-[1rem] text-brand-carvao placeholder:text-brand-tinta/55 outline-none focus:ring-0"
          {...registration}
        />
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={(event) => {
            event.preventDefault();
            setVisible((current) => !current);
          }}
          aria-controls={id}
          aria-pressed={visible}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-brand-tinta/70 transition-colors outline-none",
            "hover:text-brand-bordo focus-visible:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/35 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-marfim",
          )}
        >
          <Icon
            name={visible ? "visibility_off" : "visibility"}
            opticalSize={20}
            className="pointer-events-none text-[18px]"
          />
        </button>
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-0.5 flex items-center gap-2 text-[0.8rem] text-brand-marfim"
        >
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-brand-marfim"
          />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-0.5 text-[0.78rem] text-brand-marfim/70">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-4 animate-spin rounded-full border-[1.5px] border-brand-bordo/30 border-t-brand-bordo"
    />
  );
}
