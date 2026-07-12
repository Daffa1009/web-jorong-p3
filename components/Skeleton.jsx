export default function Skeleton({ className = "", aspect = "h-[200px]" }) {
  return (
    <div className={`skeleton rounded-lg ${aspect} ${className}`} aria-hidden="true" />
  );
}

export function ProdukGridSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20"
        >
          <Skeleton aspect="h-[200px]" className="rounded-none" />
          <div className="p-md space-y-2">
            <div className="skeleton h-4 rounded w-3/4" />
            <div className="skeleton h-3 rounded w-full" />
            <div className="skeleton h-3 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GaleriGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sm md:gap-md">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} aspect="aspect-[4/3]" />
      ))}
    </div>
  );
}
