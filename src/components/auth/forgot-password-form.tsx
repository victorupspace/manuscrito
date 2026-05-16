"use client";

import Link from "next/link";
import { useActionState, useId } from "react";

import { Icon } from "@/components/ui/icon";
import {
  requestPasswordResetAction,
  type PasswordResetState,
} from "@/features/auth/actions/request-password-reset";
import { cn } from "@/lib/utils";

const INITIAL_STATE: PasswordResetState = {};

/**
 * Formulário de "Esqueci minha senha".
 *
 * Mesma linguagem visual de `LoginForm` e `BackofficeLoginForm`: tipografia
 * Cossette Texte (sem italic), ícones Material Symbols. Sempre devolve a
 * mesma mensagem ao usuário independente da existência da conta — proteção
 * anti-enumeração já implementada no servidor.
 */
export function ForgotPasswordForm() {
  const baseId = useId();
  const [state, action, pending] = useActionState(
    requestPasswordResetAction,
    INITIAL_STATE,
  );

  const isError = state?.status === "error";
  const isOk = state?.status === "ok";
  const feedbackId = isError || isOk ? `${baseId}-feedback` : undefined;

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <header className="text-center">
        <h2 className="text-[1.5rem] font-bold leading-tight tracking-tight text-brand-marfim sm:text-[1.8rem]">
          Redefinir senha
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[0.9rem] leading-relaxed text-brand-marfim/80 sm:text-[0.93rem]">
          Informe o email da sua conta para receber as instruções.
        </p>
      </header>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${baseId}-email`}
          className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-brand-marfim/80"
        >
          Email
        </label>
        <div
          className={cn(
            "group/field flex min-h-12 items-center gap-2 rounded-md border border-brand-marfim/25 bg-brand-marfim/95 px-3 transition-colors",
            "focus-within:border-brand-marfim focus-within:bg-brand-marfim focus-within:ring-2 focus-within:ring-brand-marfim/35",
            isError
              ? "border-brand-marfim/70 bg-brand-marfim ring-2 ring-brand-marfim/30"
              : "",
          )}
        >
          <span className="flex shrink-0 items-center text-brand-tinta/70 transition-colors group-focus-within/field:text-brand-bordo">
            <Icon name="mail" opticalSize={20} className="text-[18px]" />
          </span>
          <input
            id={`${baseId}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={isError ? true : undefined}
            aria-describedby={feedbackId}
            className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 text-[1rem] text-brand-carvao placeholder:text-brand-tinta/55 outline-none focus:ring-0"
          />
        </div>
      </div>

      {state?.message ? (
        <p
          id={feedbackId}
          role={isError ? "alert" : "status"}
          className="flex items-center gap-2 rounded-md border border-brand-marfim/30 bg-brand-marfim/10 px-3 py-2 text-[0.86rem] leading-relaxed text-brand-marfim"
        >
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-marfim"
          />
          <span>{state.message}</span>
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
            <span>Enviando…</span>
          </>
        ) : (
          <>
            <span>Enviar instruções</span>
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

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-4 animate-spin rounded-full border-[1.5px] border-brand-bordo/30 border-t-brand-bordo"
    />
  );
}
