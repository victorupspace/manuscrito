import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Redefinir senha — Manuscrito",
  description:
    "Informe seu email para receber instruções de redefinição de senha.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-brand-bordo px-5 py-10 text-brand-marfim sm:px-10 sm:py-12">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_0%,rgba(245,241,232,0.10),transparent_55%),radial-gradient(120%_120%_at_100%_100%,rgba(0,0,0,0.45),transparent_55%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(rgba(245,241,232,0.7)_1px,transparent_1px)] bg-size-[18px_18px]"
      />

      <div className="brand-glass relative w-full max-w-md rounded-lg px-5 py-7 sm:px-8 sm:py-9">
        <div className="mb-6 flex items-start justify-between gap-4">
          <BrandWordmark
            href="/"
            tone="light"
            size="sm"
            subtitle="Anno mmxxvi"
          />
        </div>

        <div
          aria-hidden
          className="mb-6 flex items-center justify-center gap-3 text-brand-marfim/45"
        >
          <span className="h-px w-8 bg-current opacity-60" />
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.4em]">
            Recuperar acesso
          </span>
          <span className="h-px w-8 bg-current opacity-60" />
        </div>

        <ForgotPasswordForm />
      </div>
    </main>
  );
}
