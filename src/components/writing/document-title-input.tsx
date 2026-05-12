"use client";

export function DocumentTitleInput({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-8 sm:px-6">
      <label htmlFor="document-title" className="sr-only">
        Título do texto
      </label>
      <input
        id="document-title"
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Título do texto"
        className="w-full border-0 bg-transparent font-serif text-[2rem] leading-tight text-brand-carvao outline-none placeholder:text-brand-tinta/35 sm:text-[2.65rem]"
      />
    </div>
  );
}
