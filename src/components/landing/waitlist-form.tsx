"use client";

import { forwardRef, useId, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";

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
    // Valida a cada digitação para que `isValid` reflita o estado real e
    // possamos manter o botão desabilitado até tudo estar válido.
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
      className="flex flex-col gap-5"
      aria-describedby={serverError ? `${baseId}-server-error` : undefined}
    >
      <header className="text-center">
        <h2 className="font-serif text-[1.75rem] italic leading-tight text-brand-marfim sm:text-[2rem]">
          Solicite seu acesso
        </h2>
        <p className="mt-2 font-serif text-[0.92rem] leading-relaxed text-brand-marfim/75">
          Entre na lista beta e seja avisado quando sua conta for aprovada.
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
          className="font-serif text-[0.85rem] text-brand-marfim"
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
          "group relative mt-1 inline-flex items-center justify-center gap-3 rounded-sm border border-brand-marfim bg-brand-marfim px-6 py-3.5 font-serif text-[0.98rem] text-brand-bordo transition-all duration-200 outline-none",
          "hover:bg-brand-marfim/90 focus-visible:ring-2 focus-visible:ring-brand-marfim/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-marfim",
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
            <span>Solicitar acesso</span>
            <span
              aria-hidden
              className="inline-block translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </>
        )}
      </button>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="font-serif text-[0.72rem] uppercase tracking-[0.28em] text-brand-marfim/55">
          — Vagas limitadas · Volume I —
        </p>
        <p className="font-serif text-[0.68rem] leading-snug text-brand-marfim/45">
          Seus dados são tratados com sigilo e criptografia, conforme a LGPD.
        </p>
      </div>
    </form>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Campo de formulário editorial — label em versalete, input com underline.  */

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
        className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-marfim/70"
      >
        {label}
      </label>
      <div
        className={cn(
          "group/field flex items-center gap-2 border-b border-brand-marfim/30 transition-colors",
          "focus-within:border-brand-marfim",
          error ? "border-brand-marfim" : "",
        )}
      >
        {leadingIcon ? (
          <span className="flex shrink-0 items-center text-brand-marfim/55 transition-colors group-focus-within/field:text-brand-marfim">
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 font-serif text-[1rem] text-brand-marfim placeholder:text-brand-marfim/35 outline-none",
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
          className="mt-0.5 flex items-center gap-2 font-serif text-[0.78rem] italic text-brand-marfim"
        >
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-brand-marfim"
          />
          {error}
        </p>
      ) : hint ? (
        <p
          id={hintId}
          className="mt-0.5 font-serif text-[0.75rem] text-brand-marfim/55"
        >
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
        className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-marfim/70"
      >
        {label}
      </label>
      <div
        className={cn(
          "group/field flex items-center gap-2 border-b border-brand-marfim/30 transition-colors",
          "focus-within:border-brand-marfim",
          error ? "border-brand-marfim" : "",
        )}
      >
        <span className="flex shrink-0 items-center text-brand-marfim/55 transition-colors group-focus-within/field:text-brand-marfim">
          <Lock aria-hidden className="h-4 w-4" />
        </span>
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 font-serif text-[1rem] text-brand-marfim placeholder:text-brand-marfim/35 outline-none focus:ring-0"
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
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-brand-marfim/55 transition-colors outline-none",
            "hover:text-brand-marfim focus-visible:text-brand-marfim focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo",
          )}
        >
          {visible ? (
            <EyeOff aria-hidden className="pointer-events-none h-4 w-4" />
          ) : (
            <Eye aria-hidden className="pointer-events-none h-4 w-4" />
          )}
        </button>
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-0.5 flex items-center gap-2 font-serif text-[0.78rem] italic text-brand-marfim"
        >
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-brand-marfim"
          />
          {error}
        </p>
      ) : hint ? (
        <p
          id={hintId}
          className="mt-0.5 font-serif text-[0.75rem] text-brand-marfim/55"
        >
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
