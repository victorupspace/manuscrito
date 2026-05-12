import { AdminActionButton } from "@/components/backoffice/admin-action-button";
import { approveSignupRequestAction } from "@/features/backoffice/actions/approve-signup-request";
import { rejectSignupRequestAction } from "@/features/backoffice/actions/reject-signup-request";
import { getWaitlistRequests } from "@/features/backoffice/services/get-waitlist-requests";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function BackofficeRequestsPage() {
  const result = await getWaitlistRequests("pending");

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="font-serif text-[0.7rem] uppercase tracking-[0.32em] text-brand-tinta/70">
          Solicitações
        </p>
        <h1 className="font-serif text-[1.8rem] italic text-brand-bordo">
          Cadastros pendentes
        </h1>
        <p className="max-w-2xl font-serif text-[0.95rem] text-brand-tinta">
          Aprove ou reprove as solicitações vindas da homepage. Cada decisão é
          registrada no histórico administrativo.
        </p>
      </header>

      {result.status === "error" ? (
        <ErrorBlock message={result.message} />
      ) : result.data.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="divide-y divide-brand-bordo/10 rounded-md border border-brand-bordo/15 bg-brand-marfim/70">
          {result.data.map((request) => (
            <li
              key={request.id}
              className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="font-serif text-[1.05rem] text-brand-carvao">
                  {request.fullName}
                </p>
                <p className="font-serif text-[0.88rem] text-brand-tinta">
                  {request.email} · {request.phone}
                </p>
                <p className="font-serif text-[0.78rem] uppercase tracking-[0.22em] text-brand-tinta/65">
                  Recebido em {dateFormatter.format(new Date(request.createdAt))}
                </p>
              </div>
              <div className="flex shrink-0 items-start gap-2">
                <AdminActionButton
                  action={async () => {
                    "use server";
                    return approveSignupRequestAction(request.id);
                  }}
                  pendingLabel="Aprovando…"
                  variant="primary"
                >
                  Aprovar
                </AdminActionButton>
                <AdminActionButton
                  action={async () => {
                    "use server";
                    return rejectSignupRequestAction(request.id);
                  }}
                  pendingLabel="Reprovando…"
                  variant="danger"
                  confirm="Confirmar reprovação desta solicitação?"
                >
                  Reprovar
                </AdminActionButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-brand-bordo/25 bg-brand-marfim/40 p-8 text-center">
      <p className="font-serif italic text-brand-tinta">
        Nenhuma solicitação pendente no momento.
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
      <p className="mt-3 font-serif text-[0.85rem] italic text-brand-tinta/70">
        Verifique as credenciais do Supabase no <code>.env.local</code> e se a
        tabela <code>waitlist_requests</code> existe.
      </p>
    </div>
  );
}
