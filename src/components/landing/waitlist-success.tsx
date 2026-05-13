"use client";

export function WaitlistSuccess() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center text-center"
    >
      {/* Ornamento central — VBL §VII */}
      <span aria-hidden className="brand-filete text-brand-marfim/70">
        <span className="text-base leading-none">·</span>
      </span>

      <h2 className="mt-5 text-[1.65rem] font-bold leading-tight tracking-tight text-brand-marfim sm:text-[1.85rem]">
        Solicitação recebida.
      </h2>

      <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-brand-marfim/85">
        Você receberá uma mensagem com a confirmação da criação da sua conta e
        aprovação do acesso beta.
      </p>

      <p className="mt-8 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-marfim/65">
        Manuscrito · Anno mmxxvi
      </p>
    </div>
  );
}
