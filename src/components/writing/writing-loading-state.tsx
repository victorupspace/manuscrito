export function WritingLoadingState() {
  return (
    <div className="min-h-dvh bg-brand-marfim p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="h-12 animate-pulse rounded-md bg-brand-creme" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[16rem_1fr_18rem]">
          <div className="h-[70dvh] animate-pulse rounded-md bg-brand-creme" />
          <div className="h-[70dvh] animate-pulse rounded-md bg-brand-creme" />
          <div className="h-[70dvh] animate-pulse rounded-md bg-brand-creme" />
        </div>
      </div>
    </div>
  );
}
