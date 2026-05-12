import { SubscriptionPlanSelect } from "@/components/backoffice/subscription-plan-select";
import { updateSubscriptionPlanAction } from "@/features/backoffice/actions/update-subscription-plan";
import { getSubscriptions } from "@/features/backoffice/services/get-subscriptions";
import type { SubscriptionPlan } from "@/features/backoffice/types";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const STATUS_LABEL: Record<string, string> = {
  active: "Ativa",
  trialing: "Trial",
  canceled: "Cancelada",
  past_due: "Inadimplente",
};

export default async function BackofficeSubscriptionsPage() {
  const result = await getSubscriptions();

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="font-serif text-[0.7rem] uppercase tracking-[0.32em] text-brand-tinta/70">
          Assinaturas
        </p>
        <h1 className="font-serif text-[1.8rem] italic text-brand-bordo">
          Planos e renovações
        </h1>
        <p className="max-w-2xl font-serif text-[0.95rem] text-brand-tinta">
          Atualize manualmente o plano de cada assinatura. As mudanças são
          registradas no histórico administrativo.
        </p>
      </header>

      {result.status === "error" ? (
        <ErrorBlock message={result.message} />
      ) : result.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-md border border-brand-bordo/15 bg-brand-marfim/70">
          <table className="w-full text-left">
            <thead className="bg-brand-bordo/5 text-[0.72rem] uppercase tracking-[0.22em] text-brand-tinta/75">
              <tr>
                <th className="px-5 py-3 font-serif">Cliente</th>
                <th className="px-5 py-3 font-serif">Status</th>
                <th className="px-5 py-3 font-serif">Plano</th>
                <th className="px-5 py-3 font-serif">Início</th>
                <th className="px-5 py-3 font-serif">Renovação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-bordo/10 font-serif">
              {result.data.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-5 py-3 text-brand-carvao">
                    <div className="flex flex-col">
                      <span>{sub.customerName}</span>
                      <span className="text-[0.82rem] text-brand-tinta">
                        {sub.customerEmail}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-brand-tinta">
                    {STATUS_LABEL[sub.status] ?? sub.status}
                  </td>
                  <td className="px-5 py-3">
                    <SubscriptionPlanSelect
                      subscriptionId={sub.id}
                      value={sub.plan}
                      onChange={async (next: SubscriptionPlan) => {
                        "use server";
                        return updateSubscriptionPlanAction(sub.id, next);
                      }}
                    />
                  </td>
                  <td className="px-5 py-3 text-brand-tinta">
                    {dateFormatter.format(new Date(sub.startedAt))}
                  </td>
                  <td className="px-5 py-3 text-brand-tinta">
                    {sub.renewsAt
                      ? dateFormatter.format(new Date(sub.renewsAt))
                      : "—"}
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
        Nenhuma assinatura registrada.
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
