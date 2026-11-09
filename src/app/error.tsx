"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/States";

export default function GlobalRouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main" className="container-x grid min-h-[60dvh] place-items-center py-16">
      <div className="w-full max-w-lg">
        <ErrorState onRetry={reset} />
      </div>
    </main>
  );
}
