export function PlatformSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-64 animate-pulse rounded-lg bg-brand-creme" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-md bg-brand-creme/70"
          />
        ))}
      </div>
    </div>
  );
}

export function MaterialSkeletons() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-64 animate-pulse rounded-md bg-brand-creme/70"
        />
      ))}
    </div>
  );
}
