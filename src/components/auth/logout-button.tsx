import { logoutUserAction } from "@/features/auth/actions/logout-user";

/**
 * Botão de "sair" — server action, sem JS no client.
 *
 * Pode ser substituído futuramente por um menu mais completo na sidebar da
 * plataforma. Por ora, serve apenas para encerrar a sessão a partir do
 * placeholder em `/plataforma`.
 */
export function LogoutButton() {
  return (
    <form action={logoutUserAction}>
      <button
        type="submit"
        className="font-serif text-[0.78rem] uppercase tracking-[0.28em] text-brand-tinta transition-colors outline-none hover:text-brand-bordo focus-visible:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-marfim rounded-sm"
      >
        Sair
      </button>
    </form>
  );
}
