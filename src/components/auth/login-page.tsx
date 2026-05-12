import { LoginForm } from "@/components/auth/login-form";
import { LoginHero } from "@/components/auth/login-hero";
import type { LoginUserState } from "@/features/auth/actions/login-user";

type LoginPageProps = {
  initialReason?: LoginUserState["reason"];
  initialMessage?: string;
  /**
   * Mensagem positiva exibida acima do formulário — usada para feedback de
   * fluxos vizinhos (ex.: senha redefinida com sucesso).
   */
  notice?: string;
};

/**
 * Composição full-screen da tela de login.
 *
 * Mesma estrutura visual da landing (lado esquerdo creme, direito vinho), para
 * que o usuário aprovado sinta continuidade entre solicitar acesso e entrar.
 */
export function LoginPage({
  initialReason,
  initialMessage,
  notice,
}: LoginPageProps) {
  return (
    <main className="relative grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-brand-marfim lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1.1fr_1fr]">
      <section
        aria-labelledby="login-headline"
        className="relative isolate bg-brand-marfim text-brand-carvao"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-12 hidden font-serif text-[14rem] italic leading-none text-brand-bordo/[0.05] select-none lg:block"
        >
          M
        </span>
        <LoginHero />
      </section>

      <section
        aria-label="Entrar na plataforma"
        className="relative isolate flex items-center justify-center overflow-hidden bg-brand-bordo px-6 py-12 text-brand-marfim sm:px-10 md:px-14 lg:px-12 lg:py-14"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_0%,rgba(245,241,232,0.10),transparent_55%),radial-gradient(120%_120%_at_100%_100%,rgba(0,0,0,0.45),transparent_55%)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(rgba(245,241,232,0.7)_1px,transparent_1px)] [background-size:18px_18px]"
        />

        <div className="brand-glass relative w-full max-w-md rounded-md px-7 py-9 sm:px-9 sm:py-10">
          <div
            aria-hidden
            className="mb-6 flex items-center justify-center gap-3 text-brand-marfim/55"
          >
            <span className="h-px w-8 bg-current opacity-60" />
            <span className="text-[0.6rem] uppercase tracking-[0.4em]">
              Acesso aprovado
            </span>
            <span className="h-px w-8 bg-current opacity-60" />
          </div>

          {notice ? (
            <p
              role="status"
              className="mb-5 rounded-sm border border-brand-marfim/25 bg-brand-marfim/10 px-4 py-3 font-serif text-[0.85rem] leading-relaxed text-brand-marfim"
            >
              <span
                aria-hidden
                className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-marfim align-middle"
              />
              {notice}
            </p>
          ) : null}

          <LoginForm
            initialReason={initialReason}
            initialMessage={initialMessage}
          />
        </div>
      </section>
    </main>
  );
}
