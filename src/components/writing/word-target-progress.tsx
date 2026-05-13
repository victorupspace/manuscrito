import type { ReactNode } from "react";

export function WordTargetProgress({
  current,
  target,
  label,
  emptyLabel,
}: {
  current: number;
  target: number | null;
  label: ReactNode;
  emptyLabel: string;
}) {
  const progress = target ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const remaining = target ? Math.max(0, target - current) : 0;

  return (
    <div className="rounded-lg border border-brand-bordo/12 bg-brand-marfim p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-serif text-[0.68rem] uppercase tracking-[0.22em] text-brand-tinta/65">
            {label}
          </p>
          <p className="mt-1 font-serif text-[1.3rem] italic text-brand-bordo">
            {target
              ? `${current.toLocaleString("pt-BR")} de ${target.toLocaleString("pt-BR")}`
              : emptyLabel}
          </p>
        </div>
        {target ? (
          <span className="rounded-full bg-brand-creme px-3 py-1 font-serif text-[0.8rem] text-brand-tinta">
            {progress}%
          </span>
        ) : null}
      </div>
      <div className="mt-4 h-2 rounded-full bg-brand-creme">
        <div
          className="h-full rounded-full bg-brand-bordo transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 font-serif text-[0.82rem] text-brand-tinta">
        {target
          ? remaining === 0
            ? "Meta atingida."
            : `${remaining.toLocaleString("pt-BR")} palavras restantes`
          : "Defina uma meta para acompanhar ritmo sem transformar a escrita em corrida."}
      </p>
    </div>
  );
}
