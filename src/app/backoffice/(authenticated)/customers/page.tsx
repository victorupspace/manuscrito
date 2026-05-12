import Link from "next/link";

import { CreateCustomerForm } from "@/components/backoffice/create-customer-form";
import { getCustomers } from "@/features/backoffice/services/get-customers";
import type { Customer } from "@/features/backoffice/types";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const STATUS_LABEL: Record<Customer["status"], string> = {
  active: "Ativo",
  suspended: "Suspenso",
  removed: "Removido",
};

export default async function BackofficeCustomersPage() {
  const result = await getCustomers();

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="font-serif text-[0.7rem] uppercase tracking-[0.32em] text-brand-tinta/70">
          Clientes
        </p>
        <h1 className="font-serif text-[1.8rem] italic text-brand-bordo">
          Autores aprovados
        </h1>
        <p className="max-w-2xl font-serif text-[0.95rem] text-brand-tinta">
          Acesse a ficha de cada cliente para enviar redefinição de senha,
          suspender acesso ou atualizar o plano.
        </p>
      </header>

      <CreateCustomerForm />

      {result.status === "error" ? (
        <ErrorBlock message={result.message} />
      ) : result.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-md border border-brand-bordo/15 bg-brand-marfim/70">
          <table className="w-full text-left">
            <thead className="bg-brand-bordo/5 text-[0.72rem] uppercase tracking-[0.22em] text-brand-tinta/75">
              <tr>
                <th className="px-5 py-3 font-serif">Nome</th>
                <th className="px-5 py-3 font-serif">Email</th>
                <th className="px-5 py-3 font-serif">Plano</th>
                <th className="px-5 py-3 font-serif">Status</th>
                <th className="px-5 py-3 font-serif">Desde</th>
                <th className="px-5 py-3 font-serif text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-bordo/10 font-serif">
              {result.data.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-5 py-3 text-brand-carvao">
                    {customer.fullName}
                  </td>
                  <td className="px-5 py-3 text-brand-tinta">
                    {customer.email}
                  </td>
                  <td className="px-5 py-3 text-brand-tinta">
                    {customer.plan ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-brand-tinta">
                    {STATUS_LABEL[customer.status]}
                  </td>
                  <td className="px-5 py-3 text-brand-tinta">
                    {dateFormatter.format(new Date(customer.createdAt))}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/backoffice/customers/${customer.id}`}
                      className="font-serif text-[0.88rem] text-brand-bordo underline-offset-4 hover:underline"
                    >
                      Abrir ficha →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-brand-bordo/25 bg-brand-marfim/40 p-8 text-center">
      <p className="font-serif italic text-brand-tinta">
        Nenhum cliente cadastrado ainda.
      </p>
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-brand-bordo/30 bg-brand-marfim/70 p-5">
      <p className="font-serif text-[0.85rem] uppercase tracking-[0.24em] text-brand-bordo">
        Falha ao carregar
      </p>
      <p className="mt-2 font-serif text-[0.95rem] text-brand-tinta">
        {message}
      </p>
    </div>
  );
}
