"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function HydrationBoundary({ children }: { children: React.ReactNode }) {
  const hasHydrated = useStore((s) => s.hasHydrated);

  useEffect(() => {
    useStore.persist.rehydrate();
    useStore.setState({ hasHydrated: true });
  }, []);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-400">
        Loading your fixtures…
      </div>
    );
  }

  return <>{children}</>;
}
