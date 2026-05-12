import Link from "next/link";

import { getCustomers } from "@/features/backoffice/services/get-customers";
import { getEditorInvites } from "@/features/backoffice/services/get-editor-invites";
import { getSubscriptions } from "@/features/backoffice/services/get-subscriptions";
import { getWaitlistRequests } from "@/features/backoffice/services/get-waitlist-requests";

export const dynamic = "force-dynamic";

export default async function BackofficeDashboardPage() {
  const [requests, customers, invites, subscriptions] = await Promise.all([
    getWaitlistRequests("pending"),
    getCustomers(),
    getEditorInvites(),
    getSubscriptions(),
  ]);

  const cards: Array<{
    href: string;
    label: string;
    value: number | string;
    hint: string;
    error?: string;
  }> = [
    {
      href: "/backoffice/requests",
      label: "Solicitações pendentes",
      value:
        requests.status === "ok"
          ? requests.data.length
          : "—",
      hint: "Novos cadastros vindos da homepage.",
      error: requests.status === "error" ? requests.message : undefined,
    },
    {
      href: "/backoffice/customers",
      label: "Clientes ativos",
      value:
        customers.status === "ok"
          ? customers.data.filter((c) => c.status === "active").length
          : "—",
      hint: "Autores com conta aprovada.",
      error: customers.status === "error" ? customers.message : undefined,
    },
    {
      href: "/backoffice/editors",
      label: "Convites de editores",
      value:
        invites.status === "ok"
          ? invites.data.filter((i) => i.status === "pending").length
          : "—",
      hint: "Convites aguardando aprovação.",
      error: invites.status === "error" ? invites.message : undefined,
    },
    {
      href: "/backoffice/subscriptions",
      label: "Assinaturas",
      value: subscriptions.status === "ok" ? subscriptions.data.length : "—",
      hint: "Planos ativos e em trial.",
      error: subscriptions.status === "error" ? subscriptions.message : undefined,
    },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-1">
        <p className="font-serif text-[0.7rem] uppercase tracking-[0.32em] text-brand-tinta/70">
          Painel
        </p>
        <h1 className="font-serif text-[1.8rem] italic text-brand-bordo">
          Visão geral
        </h1>
        <p className="max-w-2xl font-serif text-[0.95rem] text-brand-tinta">
          Acompanhe novas solicitações de cadastro, status de clientes e
          editores convidados.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-md border border-brand-bordo/15 bg-brand-marfim/70 p-5 transition-colors hover:border-brand-bordo/40 hover:bg-brand-marfim"
          >
            <p className="font-serif text-[0.7rem] uppercase tracking-[0.28em] text-brand-tinta/70">
              {card.label}
            </p>
            <p className="mt-2 font-serif text-[2rem] italic text-brand-bordo">
              {card.value}
            </p>
            <p className="mt-1 font-serif text-[0.85rem] text-brand-tinta">
              {card.hint}
            </p>
            {card.error ? (
              <p className="mt-2 font-serif text-[0.75rem] italic text-brand-bordo/80">
                {card.error}
              </p>
            ) : null}
          </Link>
        ))}
      </section>
    </div>
  );
}
