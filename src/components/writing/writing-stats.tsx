"use client";

import { Target } from "lucide-react";

import { useWritingStore } from "@/stores/writing-store";

const formatter = new Intl.NumberFormat("pt-BR");

export function WritingStats({ targetWords }: { targetWords: number | null }) {
  const wordCount = useWritingStore((state) => state.wordCount);
  const characterCount = useWritingStore((state) => state.characterCount);
  const readingTime = useWritingStore((state) => state.readingTime);
  const progress = targetWords
    ? Math.min(100, Math.round((wordCount / targetWords) * 100))
    : 0;

  return (
    <div className="grid grid-cols-3 gap-2">
      <Stat label="Palavras" value={formatter.format(wordCount)} />
      <Stat label="Caracteres" value={formatter.format(characterCount)} />
      <Stat label="Leitura" value={`${readingTime} min`} />
      {targetWords ? (
        <div className="col-span-3 mt-2 rounded-md border border-brand-bordo/10 bg-brand-marfim p-3">
          <div className="flex items-center justify-between gap-3 font-serif text-[0.8rem] text-brand-tinta">
            <span className="inline-flex items-center gap-2">
              <Target className="size-3.5 text-brand-bordo" />
              Meta de palavras
            </span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-brand-pergaminho">
            <div
              className="h-full rounded-full bg-brand-bordo"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-brand-bordo/10 bg-brand-marfim p-3">
      <p className="font-serif text-[0.65rem] uppercase tracking-[0.2em] text-brand-tinta/65">
        {label}
      </p>
      <p className="mt-1 font-serif text-[1.05rem] italic text-brand-bordo">
        {value}
      </p>
    </div>
  );
}
