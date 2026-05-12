import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminActionButton } from "@/components/backoffice/admin-action-button";
import { removeCustomerAction } from "@/features/backoffice/actions/remove-customer";
import { sendPasswordResetLinkAction } from "@/features/backoffice/actions/send-password-reset-link";
import { getCustomerById } from "@/features/backoffice/services/get-customer-by-id";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function BackofficeCustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const result = await getCustomerById(customerId);

  if (result.status === "error") {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="rounded-md border border-brand-bordo/30 bg-brand-marfim/70 p-5">
          <p className="font-serif text-[0.85rem] uppercase tracking-[0.24em] text-brand-bordo">
            Falha ao carregar
          </p>
          <p className="mt-2 font-serif text-[0.95rem] text-brand-tinta">
            {result.message}
          </p>
        </div>
      </div>
    );
  }

  if (!result.data) {
    notFound();
  }

  const customer = result.data;

  return (
    <div className="space-y-8">
      <BackLink />

      <header className="space-y-1">
        <p className="font-serif text-[0.7rem] uppercase tracking-[0.32em] text-brand-tinta/70">
          Cliente
        </p>
        <h1 className="font-serif text-[1.8rem] italic text-brand-bordo">
          {customer.fullName}
        </h1>
        <p className="font-serif text-[0.95rem] text-brand-tinta">
          {customer.email}
          {customer.phone ? ` · ${customer.phone}` : ""}
        </p>
      </header>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Info label="Status" value={customer.status} />
        <Info label="Plano" value={customer.plan ?? "—"} />
        <Info
          label="Cadastrado em"
          value={dateFormatter.format(new Date(customer.createdAt))}
        />
      </dl>

      <section className="space-y-4">
        <h2 className="font-serif text-[1.1rem] italic text-brand-bordo">
          Ações administrativas
        </h2>

        <div className="flex flex-wrap items-start gap-3">
          <AdminActionButton
            action={async () => {
              "use server";
              return sendPasswordResetLinkAction(customer.email);
            }}
            pendingLabel="Enviando…"
            variant="primary"
          >
            Enviar link de redefinição de senha
          </AdminActionButton>

          <AdminActionButton
            action={async () => {
              "use server";
              return removeCustomerAction(customer.id, { suspendOnly: true });
            }}
            pendingLabel="Suspendendo…"
            variant="ghost"
            confirm="Suspender este cliente?"
          >
            Suspender
          </AdminActionButton>

          <AdminActionButton
            action={async () => {
              "use server";
              return removeCustomerAction(customer.id);
            }}
            pendingLabel="Removendo…"
            variant="danger"
            confirm="Remover este cliente? A ação é registrada no histórico."
          >
            Remover
          </AdminActionButton>
        </div>
      </section>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/backoffice/customers"
      className="inline-flex items-center gap-2 font-serif text-[0.88rem] text-brand-bordo underline-offset-4 hover:underline"
    >
      ← Voltar para clientes
    </Link>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-brand-bordo/15 bg-brand-marfim/70 p-4">
      <dt className="font-serif text-[0.7rem] uppercase tracking-[0.28em] text-brand-tinta/70">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-[1rem] text-brand-carvao">{value}</dd>
    </div>
  );
}
