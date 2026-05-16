"use client";

import { useState } from "react";

import { LandingCopy } from "@/components/landing/landing-copy";
import { LoginEntry } from "@/components/landing/login-entry";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { WaitlistSuccess } from "@/components/landing/waitlist-success";

export function LandingPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="relative grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-brand-marfim lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1.1fr_1fr]">
      {/* Lado esquerdo — institucional (creme/marfim) */}
      <section
        aria-labelledby="hero-headline"
        className="relative isolate bg-brand-marfim text-brand-carvao"
      >
        {/* Marca d'água decorativa, sutil */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-12 hidden font-serif text-[14rem] italic leading-none text-brand-bordo/[0.05] select-none lg:block xl:text-[16rem]"
        >
          M
        </span>
        <LandingCopy />
      </section>

      {/* Lado direito — formulário sobre fundo vinho */}
      <section
        aria-label="Cadastro beta"
        className="relative isolate flex items-center justify-center overflow-hidden bg-brand-bordo px-5 py-10 text-brand-marfim sm:px-10 sm:py-12 md:px-14 lg:px-12 lg:py-14"
      >
        {/* Camadas de profundidade — gradiente + textura sutil */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_0%,rgba(245,241,232,0.10),transparent_55%),radial-gradient(120%_120%_at_100%_100%,rgba(0,0,0,0.45),transparent_55%)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(rgba(245,241,232,0.7)_1px,transparent_1px)] [background-size:18px_18px]"
        />

        {/* Card com glass effect + microcopy de login abaixo */}
        <div className="relative flex w-full max-w-md flex-col gap-5">
          <div
            className="brand-glass relative w-full rounded-lg px-5 py-7 sm:px-8 sm:py-9"
            data-state={submitted ? "success" : "form"}
          >
            {/* Ornamento de página de rosto */}
            <div
              aria-hidden
              className="mb-6 flex items-center justify-center gap-3 text-brand-marfim/45"
            >
              <span className="h-px w-8 bg-current opacity-60" />
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.4em]">
                Anno mmxxvi
              </span>
              <span className="h-px w-8 bg-current opacity-60" />
            </div>

            <div className="grid">
              {/* Mesma área visual abriga as duas etapas — transição editorial. */}
              <div
                className={
                  "col-start-1 row-start-1 transition-all duration-500 ease-out " +
                  (submitted
                    ? "pointer-events-none -translate-y-1 opacity-0"
                    : "translate-y-0 opacity-100")
                }
                aria-hidden={submitted}
              >
                <WaitlistForm onSuccess={() => setSubmitted(true)} />
              </div>

              <div
                className={
                  "col-start-1 row-start-1 transition-all duration-500 ease-out " +
                  (submitted
                    ? "translate-y-0 opacity-100 delay-150"
                    : "pointer-events-none translate-y-2 opacity-0")
                }
                aria-hidden={!submitted}
              >
                <WaitlistSuccess />
              </div>
            </div>
          </div>

          <LoginEntry tone="dark" className="justify-center text-center" />
        </div>
      </section>
    </main>
  );
}
