"use client";

import { useActionState, useId, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import {
  loginBackofficeAction,
  type LoginBackofficeState,
} from "@/features/backoffice/auth/actions/login-backoffice";
import { cn } from "@/lib/utils";

const INITIAL_STATE: LoginBackofficeState = {};

export function BackofficeLoginForm() {
  const baseId = useId();
  const [state, action, pending] = useActionState(
    loginBackofficeAction,
    INITIAL_STATE,
  );
  const [showPassword, setShowPassword] = useState(false);

  const errorId = state?.error ? `${baseId}-error` : undefined;

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <Field
        id={`${baseId}-email`}
        name="email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        invalid={Boolean(state?.error)}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${baseId}-password`}
          className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-marfim/70"
        >
          Senha
        </label>
        <div
          className={cn(
            "group/field flex items-center gap-2 border-b border-brand-marfim/30 transition-colors",
            "focus-within:border-brand-marfim",
            state?.error ? "border-brand-marfim" : "",
          )}
        >
          <span className="flex shrink-0 items-center text-brand-marfim/55 transition-colors group-focus-within/field:text-brand-marfim">
            <Lock aria-hidden className="h-4 w-4" />
          </span>
          <input
            id={`${baseId}-password`}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={state?.error ? true : undefined}
            aria-describedby={errorId}
            className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 font-serif text-[1rem] text-brand-marfim placeholder:text-brand-marfim/35 outline-none focus:ring-0"
          />
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setShowPassword((current) => !current)}
            aria-pressed={showPassword}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-brand-marfim/55 transition-colors outline-none",
              "hover:text-brand-marfim focus-visible:text-brand-marfim focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo",
            )}
          >
            {showPassword ? (
              <EyeOff aria-hidden className="pointer-events-none h-4 w-4" />
            ) : (
              <Eye aria-hidden className="pointer-events-none h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {state?.error ? (
        <p
          id={errorId}
          role="alert"
          className="font-serif text-[0.85rem] text-brand-marfim"
        >
          <span
            aria-hidden
            className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-marfim align-middle"
          />
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        aria-disabled={pending || undefined}
        aria-busy={pending || undefined}
        className={cn(
          "group relative mt-1 inline-flex items-center justify-center gap-3 rounded-sm border border-brand-marfim bg-brand-marfim px-6 py-3.5 font-serif text-[0.98rem] text-brand-bordo transition-all duration-200 outline-none",
          "hover:bg-brand-marfim/90 focus-visible:ring-2 focus-visible:ring-brand-marfim/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-marfim",
          "active:translate-y-px",
        )}
      >
        {pending ? (
          <>
            <Spinner />
            <span>Entrando…</span>
          </>
        ) : (
          <>
            <span>Entrar</span>
            <span
              aria-hidden
              className="inline-block translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </>
        )}
      </button>
    </form>
  );
}

type FieldProps = Omit<React.ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  invalid?: boolean;
};

function Field({ id, label, invalid, className, ...inputProps }: FieldProps) {
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
          invalid ? "border-brand-marfim" : "",
        )}
      >
        <input
          id={id}
          aria-invalid={invalid ? true : undefined}
          className={cn(
            "min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 font-serif text-[1rem] text-brand-marfim placeholder:text-brand-marfim/35 outline-none focus:ring-0",
            className,
          )}
          {...inputProps}
        />
      </div>
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
