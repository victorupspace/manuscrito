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
    <form action={action} className="flex flex-col gap-5" noValidate>
      <header>
        <h2 className="text-[1.4rem] font-bold leading-tight tracking-tight text-brand-marfim sm:text-[1.6rem]">
          Acessar plataforma
        </h2>
        <p className="mt-2 text-[0.92rem] leading-relaxed text-brand-marfim/75">
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
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${baseId}-password`}
          className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-brand-marfim/75"
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
            className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 text-[1rem] text-brand-marfim placeholder:text-brand-marfim/40 outline-none focus:ring-0"
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
            <Icon
              name={showPassword ? "visibility_off" : "visibility"}
              opticalSize={20}
              className="pointer-events-none text-[18px]"
            />
          </button>
        </div>
      </div>

      {state?.error ? (
        <p
          id={errorId}
          role="alert"
          className="text-[0.88rem] leading-relaxed text-brand-marfim"
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
          "group relative mt-1 inline-flex items-center justify-center gap-3 rounded-md bg-brand-marfim px-6 py-3.5 text-[0.95rem] font-bold text-brand-bordo transition-all duration-200 outline-none",
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
            <Icon
              name="arrow_forward"
              opticalSize={20}
              className="text-[18px] transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </>
        )}
      </button>

      <div className="mt-1 flex flex-col gap-2 text-center">
        <Link
          href="/forgot-password"
          className="rounded-sm text-[0.85rem] text-brand-marfim/75 underline-offset-4 transition-colors outline-none hover:text-brand-marfim hover:underline focus-visible:text-brand-marfim focus-visible:underline focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo"
        >
          Esqueci minha senha
        </Link>
        <p className="text-[0.82rem] text-brand-marfim/60">
          Ainda não tenho conta?{" "}
          <Link
            href="/"
            className="rounded-sm font-bold text-brand-marfim/80 underline-offset-4 transition-colors outline-none hover:text-brand-marfim hover:underline focus-visible:text-brand-marfim focus-visible:underline focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo"
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
};

function Field({ id, label, invalid, className, ...inputProps }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-brand-marfim/75"
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
            "min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 text-[1rem] text-brand-marfim placeholder:text-brand-marfim/40 outline-none focus:ring-0",
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
