"use client";

export function WaitlistSuccess() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center text-center"
    >
      {/* Ornamento central — VBL §VII */}
      <span
        aria-hidden
        className="brand-filete font-serif text-brand-marfim/70"
      >
        <span className="text-base leading-none">·</span>
      </span>

      <h2 className="mt-5 font-serif text-3xl italic leading-tight text-brand-marfim sm:text-[2rem]">
        Solicitação recebida.
      </h2>

      <p className="mt-4 max-w-sm font-serif text-[0.98rem] leading-relaxed text-brand-marfim/80">
        Você receberá uma mensagem com a confirmação da criação da sua conta e
        aprovação do acesso beta.
      </p>

      <p className="mt-8 font-serif text-[0.68rem] uppercase tracking-[0.32em] text-brand-marfim/55">
        — Manuscrito · Anno mmxxvi —
      </p>
    </div>
  );
}
