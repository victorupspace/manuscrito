"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";

import { Icon } from "@/components/ui/icon";
import {
  updatePasswordAction,
  type UpdatePasswordState,
} from "@/features/auth/actions/update-password";
import { cn } from "@/lib/utils";

const INITIAL_STATE: UpdatePasswordState = {};

/**
 * Formulário de troca de senha — usado em `/reset-password` após o callback
 * do Supabase já ter trocado o `code` por uma sessão temporária.
 *
 * Mesma linguagem visual de `LoginForm` e `BackofficeLoginForm`. O server
 * action confere a sessão antes de gravar a nova senha; aqui o client cuida
 * apenas da UX (toggle de visibilidade, mensagens por campo).
 */
export function ResetPasswordForm() {
  const baseId = useId();
  const [state, action, pending] = useActionState(
    updatePasswordAction,
    INITIAL_STATE,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const globalErrorId = state?.error ? `${baseId}-error` : undefined;

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <header className="text-center">
        <h2 className="text-[1.5rem] font-bold leading-tight tracking-tight text-brand-marfim sm:text-[1.8rem]">
          Defina uma nova senha
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[0.9rem] leading-relaxed text-brand-marfim/80 sm:text-[0.93rem]">
          Escolha uma senha que você consiga lembrar com facilidade.
        </p>
      </header>

      <PasswordField
        id={`${baseId}-password`}
        name="password"
        label="Nova senha"
        hint="Mínimo de 8 caracteres."
        error={state?.fieldErrors?.password}
        visible={showPassword}
        onToggle={() => setShowPassword((current) => !current)}
        autoComplete="new-password"
      />

      <PasswordField
        id={`${baseId}-confirmPassword`}
        name="confirmPassword"
        label="Repita a nova senha"
        error={state?.fieldErrors?.confirmPassword}
        visible={showConfirm}
        onToggle={() => setShowConfirm((current) => !current)}
        autoComplete="new-password"
      />

      {state?.error ? (
        <p
          id={globalErrorId}
          role="alert"
          className="flex items-center gap-2 rounded-md border border-brand-marfim/30 bg-brand-marfim/10 px-3 py-2 text-[0.86rem] leading-relaxed text-brand-marfim"
        >
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-marfim"
          />
          <span>{state.error}</span>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        aria-disabled={pending || undefined}
        aria-busy={pending || undefined}
        className={cn(
          "group relative mt-1 inline-flex items-center justify-center gap-3 rounded-md bg-brand-marfim px-6 py-3.5 text-[0.95rem] font-bold text-brand-bordo shadow-sm transition-all duration-200 outline-none",
          "hover:bg-brand-bordo-profundo hover:text-brand-marfim focus-visible:ring-2 focus-visible:ring-brand-marfim/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo",
          "disabled:cursor-not-allowed disabled:bg-brand-marfim/30 disabled:text-brand-marfim/55 disabled:hover:bg-brand-marfim/30 disabled:hover:text-brand-marfim/55",
          "active:translate-y-px",
        )}
      >
        {pending ? (
          <>
            <Spinner />
            <span>Salvando…</span>
          </>
        ) : (
          <>
            <span>Atualizar senha</span>
            <Icon
              name="arrow_forward"
              opticalSize={20}
              className="text-[18px] transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </>
        )}
      </button>

      <p className="mt-2 text-center text-[0.82rem] text-brand-marfim/65">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-sm font-bold text-brand-marfim underline-offset-4 transition-colors outline-none hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo"
        >
          <span aria-hidden>←</span> Voltar para o login
        </Link>
      </p>
    </form>
  );
}

type PasswordFieldProps = {
  id: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  visible: boolean;
  onToggle: () => void;
  autoComplete: string;
};

function PasswordField({
  id,
  name,
  label,
  hint,
  error,
  visible,
  onToggle,
  autoComplete,
}: PasswordFieldProps) {
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
          "group/field flex min-h-12 items-center gap-2 rounded-md border border-brand-marfim/25 bg-brand-marfim/95 px-3 transition-colors",
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
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 text-[1rem] text-brand-carvao placeholder:text-brand-tinta/55 outline-none focus:ring-0"
        />
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onToggle}
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
          <span>{error}</span>
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
