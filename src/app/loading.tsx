import { Skeleton } from "@/components/ui/States";

export default function Loading() {
  return (
    <div className="container-x space-y-4 py-16" role="status" aria-busy="true">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
