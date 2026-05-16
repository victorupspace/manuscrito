"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";

import { Icon } from "@/components/ui/icon";
import {
  loginUserAction,
  type LoginUserState,
} from "@/features/auth/actions/login-user";
import { cn } from "@/lib/utils";

const INITIAL_STATE: LoginUserState = {};

type LoginFormProps = {
  initialReason?: LoginUserState["reason"];
  initialMessage?: string;
};

/**
 * Formulário de login do usuário comum (sobre fundo vinho).
 *
 * Mesma linguagem visual do `BackofficeLoginForm`: tipografia Cossette
 * Texte (não-italic), ícones Material Symbols, contraste alto sobre o
 * card escuro. Mantém os links extras (reset de senha e voltar à landing)
 * que não existem no backoffice.
 *
 * A validação acontece no servidor (server action). O client apenas aciona
 * `useActionState` e cuida de toggles puramente visuais (mostrar senha).
 */
export function LoginForm({ initialReason, initialMessage }: LoginFormProps) {
  const baseId = useId();
  const [state, action, pending] = useActionState(
    loginUserAction,
    initialMessage
      ? { error: initialMessage, reason: initialReason }
      : INITIAL_STATE,
  );
  const [showPassword, setShowPassword] = useState(false);

  const errorId = state?.error ? `${baseId}-error` : undefined;

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <header className="text-center">
        <h2 className="text-[1.5rem] font-bold leading-tight tracking-tight text-brand-marfim sm:text-[1.8rem]">
          Acessar plataforma
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[0.9rem] leading-relaxed text-brand-marfim/80 sm:text-[0.93rem]">
          Use o email e a senha cadastrados para entrar na sua conta.
        </p>
      </header>

      <Field
        id={`${baseId}-email`}
        name="email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        invalid={Boolean(state?.error)}
        leadingIcon={<Icon name="mail" opticalSize={20} className="text-[18px]" />}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${baseId}-password`}
          className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-brand-marfim/80"
        >
          Senha
        </label>
        <div
          className={cn(
            "group/field flex min-h-12 items-center gap-2 rounded-md border border-brand-marfim/25 bg-brand-marfim/95 px-3 transition-colors",
            "focus-within:border-brand-marfim focus-within:bg-brand-marfim focus-within:ring-2 focus-within:ring-brand-marfim/35",
            state?.error
              ? "border-brand-marfim/70 bg-brand-marfim ring-2 ring-brand-marfim/30"
              : "",
          )}
        >
          <span className="flex shrink-0 items-center text-brand-tinta/70 transition-colors group-focus-within/field:text-brand-bordo">
            <Icon name="lock" opticalSize={20} className="text-[18px]" />
          </span>
          <input
            id={`${baseId}-password`}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={state?.error ? true : undefined}
            aria-describedby={errorId}
            className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 text-[1rem] text-brand-carvao placeholder:text-brand-tinta/55 outline-none focus:ring-0"
          />
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setShowPassword((current) => !current)}
            aria-pressed={showPassword}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-brand-tinta/70 transition-colors outline-none",
              "hover:text-brand-bordo focus-visible:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/35 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-marfim",
            )}
          >
            <Icon
              name={showPassword ? "visibility_off" : "visibility"}
              opticalSize={20}
              className="pointer-events-none text-[18px]"
            />
          </button>
        </div>
        <div className="mt-1 flex justify-end">
          <Link
            href="/forgot-password"
            className="rounded-sm text-[0.78rem] text-brand-marfim/75 underline-offset-4 transition-colors outline-none hover:text-brand-marfim hover:underline focus-visible:text-brand-marfim focus-visible:underline focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo"
          >
            Esqueci minha senha
          </Link>
        </div>
      </div>

      {state?.error ? (
        <p
          id={errorId}
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
            <span>Entrando…</span>
          </>
        ) : (
          <>
            <span>Entrar</span>
            <Icon
              name="arrow_forward"
              opticalSize={20}
              className="text-[18px] transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </>
        )}
      </button>

      <div className="mt-2 flex flex-col items-center gap-1.5 text-center">
        <p className="text-[0.82rem] text-brand-marfim/65">
          Ainda não tenho conta?{" "}
          <Link
            href="/"
            className="rounded-sm font-bold text-brand-marfim underline-offset-4 transition-colors outline-none hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </form>
  );
}

type FieldProps = Omit<React.ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  invalid?: boolean;
  leadingIcon?: React.ReactNode;
};

function Field({
  id,
  label,
  invalid,
  className,
  leadingIcon,
  ...inputProps
}: FieldProps) {
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
          invalid
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
          id={id}
          aria-invalid={invalid ? true : undefined}
          className={cn(
            "min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 text-[1rem] text-brand-carvao placeholder:text-brand-tinta/55 outline-none focus:ring-0",
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
