"use client";

import Link from "next/link";
import { useActionState, useId } from "react";

import {
  requestPasswordResetAction,
  type PasswordResetState,
} from "@/features/auth/actions/request-password-reset";
import { cn } from "@/lib/utils";

const INITIAL_STATE: PasswordResetState = {};

/**
 * Formulário de "Esqueci minha senha".
 *
 * Comportamento:
 *  - Sempre devolve a mesma mensagem ao usuário, exista ou não a conta.
 *  - O envio real do e-mail é responsabilidade do Supabase Auth.
 */
export function ForgotPasswordForm() {
  const baseId = useId();
  const [state, action, pending] = useActionState(
    requestPasswordResetAction,
    INITIAL_STATE,
  );

  const isError = state?.status === "error";
  const isOk = state?.status === "ok";
  const feedbackId =
    isError || isOk ? `${baseId}-feedback` : undefined;

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <header>
        <h2 className="font-serif text-[1.55rem] italic leading-tight text-brand-marfim sm:text-[1.75rem]">
          Redefinir senha
        </h2>
        <p className="mt-2 font-serif text-[0.92rem] leading-relaxed text-brand-marfim/75">
          Informe o email da sua conta para receber as instruções.
        </p>
      </header>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${baseId}-email`}
          className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-marfim/70"
        >
          Email
        </label>
        <div
          className={cn(
            "group/field flex items-center gap-2 border-b border-brand-marfim/30 transition-colors",
            "focus-within:border-brand-marfim",
            isError ? "border-brand-marfim" : "",
          )}
        >
          <input
            id={`${baseId}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={isError ? true : undefined}
            aria-describedby={feedbackId}
            className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 font-serif text-[1rem] text-brand-marfim placeholder:text-brand-marfim/35 outline-none focus:ring-0"
          />
        </div>
      </div>

      {state?.message ? (
        <p
          id={feedbackId}
          role={isError ? "alert" : "status"}
          className="font-serif text-[0.85rem] leading-relaxed text-brand-marfim"
        >
          <span
            aria-hidden
            className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-marfim align-middle"
          />
          {state.message}
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
            <span>Enviando…</span>
          </>
        ) : (
          <>
            <span>Enviar instruções</span>
            <span
              aria-hidden
              className="inline-block translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </>
        )}
      </button>

      <p className="text-center font-serif text-[0.85rem] italic text-brand-marfim/75">
        <Link
          href="/login"
          className="underline-offset-4 transition-colors outline-none hover:text-brand-marfim hover:underline focus-visible:text-brand-marfim focus-visible:underline focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo rounded-sm"
        >
          Voltar para o login
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
