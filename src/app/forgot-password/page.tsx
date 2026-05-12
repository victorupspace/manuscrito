import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Redefinir senha — Manuscrito",
  description:
    "Informe seu email para receber instruções de redefinição de senha.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-brand-bordo px-6 py-12 text-brand-marfim sm:px-10">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_0%,rgba(245,241,232,0.10),transparent_55%),radial-gradient(120%_120%_at_100%_100%,rgba(0,0,0,0.45),transparent_55%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(rgba(245,241,232,0.7)_1px,transparent_1px)] [background-size:18px_18px]"
      />

      <div className="brand-glass relative w-full max-w-md rounded-md px-7 py-9 sm:px-9 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            aria-label="Manuscrito — voltar à página inicial"
            className="font-serif italic text-xl text-brand-marfim outline-none focus-visible:ring-2 focus-visible:ring-brand-marfim/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bordo rounded-sm"
          >
            Manuscrito
          </Link>
          <span className="font-serif text-[0.6rem] uppercase tracking-[0.4em] text-brand-marfim/55">
            Anno mmxxvi
          </span>
        </div>

        <ForgotPasswordForm />
      </div>
    </main>
  );
}
