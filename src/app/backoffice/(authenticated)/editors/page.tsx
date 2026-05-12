import { AdminActionButton } from "@/components/backoffice/admin-action-button";
import { EditorPermissionSelect } from "@/components/backoffice/editor-permission-select";
import { approveEditorInviteAction } from "@/features/backoffice/actions/approve-editor-invite";
import { rejectEditorInviteAction } from "@/features/backoffice/actions/reject-editor-invite";
import { updateEditorPermissionAction } from "@/features/backoffice/actions/update-editor-permission";
import { getEditorInvites } from "@/features/backoffice/services/get-editor-invites";
import type { EditorPermission } from "@/features/backoffice/types";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Reprovado",
  revoked: "Revogado",
};

export default async function BackofficeEditorsPage() {
  const result = await getEditorInvites();

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="font-serif text-[0.7rem] uppercase tracking-[0.32em] text-brand-tinta/70">
          Editores
        </p>
        <h1 className="font-serif text-[1.8rem] italic text-brand-bordo">
          Convites e permissões
        </h1>
        <p className="max-w-2xl font-serif text-[0.95rem] text-brand-tinta">
          Aprove convites enviados por usuários master e ajuste o nível de
          acesso (viewer · commenter · editor).
        </p>
      </header>

      {result.status === "error" ? (
        <ErrorBlock message={result.message} />
      ) : result.data.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="divide-y divide-brand-bordo/10 rounded-md border border-brand-bordo/15 bg-brand-marfim/70">
          {result.data.map((invite) => {
            const isPending = invite.status === "pending";
            return (
              <li
                key={invite.id}
                className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-serif text-[1.05rem] text-brand-carvao">
                    {invite.editorEmail}
                  </p>
                  <p className="font-serif text-[0.88rem] text-brand-tinta">
                    Convidado por {invite.masterUserName} ({invite.masterUserEmail})
                  </p>
                  <p className="font-serif text-[0.78rem] uppercase tracking-[0.22em] text-brand-tinta/65">
                    {STATUS_LABEL[invite.status] ?? invite.status} ·{" "}
                    {dateFormatter.format(new Date(invite.createdAt))}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <EditorPermissionSelect
                    inviteId={invite.id}
                    value={invite.permission}
                    onChange={async (next: EditorPermission) => {
                      "use server";
                      return updateEditorPermissionAction(invite.id, next);
                    }}
                  />

                  {isPending ? (
                    <div className="flex shrink-0 gap-2">
                      <AdminActionButton
                        action={async () => {
                          "use server";
                          return approveEditorInviteAction(invite.id);
                        }}
                        pendingLabel="Aprovando…"
                        variant="primary"
                      >
                        Aprovar
                      </AdminActionButton>
                      <AdminActionButton
                        action={async () => {
                          "use server";
                          return rejectEditorInviteAction(invite.id);
                        }}
                        pendingLabel="Reprovando…"
                        variant="danger"
                        confirm="Confirmar reprovação do convite?"
                      >
                        Reprovar
                      </AdminActionButton>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-brand-bordo/25 bg-brand-marfim/40 p-8 text-center">
      <p className="font-serif italic text-brand-tinta">
        Nenhum convite registrado.
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
