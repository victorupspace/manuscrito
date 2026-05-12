import Link from "next/link";

export function WritingErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-brand-marfim p-6">
      <div className="max-w-md rounded-lg border border-brand-bordo/20 bg-brand-creme/70 p-6">
        <p className="font-serif text-[0.72rem] uppercase tracking-[0.26em] text-brand-bordo">
          Falha ao carregar
        </p>
        <h1 className="mt-2 font-serif text-[1.6rem] italic text-brand-carvao">
          Não foi possível abrir este texto.
        </h1>
        <p className="mt-2 font-serif text-brand-tinta">{message}</p>
        <Link
          href="/plataforma"
          className="mt-5 inline-flex rounded-md border border-brand-bordo bg-brand-bordo px-4 py-2 font-serif text-brand-marfim"
        >
          Voltar para plataforma
        </Link>
      </div>
    </div>
  );
}
