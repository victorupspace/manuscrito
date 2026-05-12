"use client";

import { useState, useTransition } from "react";

import {
  createCustomerAction,
  type CreateCustomerInput,
} from "@/features/backoffice/actions/create-customer";
import { formatBrazilianPhone } from "@/lib/validations/waitlist";
import { cn } from "@/lib/utils";

const PLAN_OPTIONS: { value: CreateCustomerInput["plan"]; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "solo", label: "Solo" },
  { value: "studio", label: "Studio" },
  { value: "atelier", label: "Atelier" },
];

const INITIAL_VALUES: CreateCustomerInput = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  plan: "free",
};

export function CreateCustomerForm() {
  const [values, setValues] = useState<CreateCustomerInput>(INITIAL_VALUES);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof CreateCustomerInput>(
    key: K,
    value: CreateCustomerInput[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      className="space-y-4 rounded-md border border-brand-bordo/15 bg-brand-marfim/70 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);
        startTransition(async () => {
          const result = await createCustomerAction(values);
          if (result.status === "error") {
            setMessage({ type: "error", text: result.message });
            return;
          }
          setValues(INITIAL_VALUES);
          setMessage({ type: "success", text: "Cliente cadastrado." });
        });
      }}
    >
      <div className="space-y-1">
        <h2 className="font-serif text-[1.1rem] italic text-brand-bordo">
          Cadastrar cliente
        </h2>
        <p className="font-serif text-[0.88rem] text-brand-tinta">
          Cria o acesso no Supabase Auth, o perfil de cliente e a assinatura.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <Field
          label="Nome"
          className="lg:col-span-2"
          value={values.fullName}
          onChange={(value) => update("fullName", value)}
          autoComplete="name"
        />
        <Field
          label="Email"
          type="email"
          className="lg:col-span-2"
          value={values.email}
          onChange={(value) => update("email", value)}
          autoComplete="email"
        />
        <label className="flex flex-col gap-1">
          <span className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-tinta/70">
            Plano
          </span>
          <select
            value={values.plan}
            disabled={pending}
            onChange={(event) =>
              update("plan", event.target.value as CreateCustomerInput["plan"])
            }
            className="h-10 rounded-sm border border-brand-bordo/25 bg-brand-marfim px-3 font-serif text-[0.92rem] text-brand-carvao outline-none focus-visible:border-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/25"
          >
            {PLAN_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Telefone"
          type="tel"
          value={values.phone ?? ""}
          onChange={(value) => update("phone", formatBrazilianPhone(value))}
          autoComplete="tel-national"
        />
        <Field
          label="Senha inicial"
          type="password"
          className="lg:col-span-2"
          value={values.password}
          onChange={(value) => update("password", value)}
          autoComplete="new-password"
        />
        <div className="flex items-end lg:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 items-center justify-center rounded-sm border border-brand-bordo bg-brand-bordo px-4 font-serif text-[0.9rem] text-brand-marfim transition-colors hover:bg-brand-bordo-profundo disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Cadastrando..." : "Cadastrar cliente"}
          </button>
        </div>
      </div>

      {message ? (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={cn(
            "font-serif text-[0.82rem] italic",
            message.type === "error" ? "text-brand-bordo" : "text-brand-tinta",
          )}
        >
          {message.text}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "onChange"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-tinta/70">
        {label}
      </span>
      <input
        value={value}
        disabled={props.disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-sm border border-brand-bordo/25 bg-brand-marfim px-3 font-serif text-[0.92rem] text-brand-carvao outline-none placeholder:text-brand-tinta/40 focus-visible:border-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/25"
        {...props}
      />
    </label>
  );
}
