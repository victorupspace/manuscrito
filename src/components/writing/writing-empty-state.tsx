import { PenLine } from "lucide-react";

export function WritingEmptyState() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center bg-brand-marfim p-6">
      <div className="max-w-md rounded-lg border border-dashed border-brand-bordo/25 bg-brand-creme/60 p-8 text-center">
        <PenLine className="mx-auto size-8 text-brand-bordo" />
        <h1 className="mt-4 font-serif text-[1.6rem] italic text-brand-bordo">
          O texto começa aqui.
        </h1>
        <p className="mt-2 font-serif text-brand-tinta">
          Crie um capítulo, cena ou nota na estrutura lateral para começar.
        </p>
      </div>
    </div>
  );
}
