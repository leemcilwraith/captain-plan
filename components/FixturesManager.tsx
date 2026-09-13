"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { sortByDateTime } from "@/lib/date";
import FixtureCard from "./FixtureCard";
import FixtureForm from "./FixtureForm";

export default function FixturesManager() {
  const fixtures = useStore((s) => s.fixtures);
  const [adding, setAdding] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const sorted = [...fixtures].sort(sortByDateTime);
  const upcoming = sorted.filter((f) => f.date >= today);
  const past = sorted.filter((f) => f.date < today).reverse();

  return (
    <div className="space-y-4">
      {adding ? (
        <FixtureForm onDone={() => setAdding(false)} />
      ) : (
        <button className="btn-primary w-full" onClick={() => setAdding(true)}>
          + Add fixture
        </button>
      )}

      {fixtures.length === 0 && !adding && (
        <p className="text-center text-sm text-slate-400">
          No fixtures yet. Add your teams and venues first, then schedule a fixture. New here? See the{" "}
          <Link href="/guide" className="text-pitch-600 underline">
            Guide
          </Link>{" "}
          for the full setup order.
        </p>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Upcoming</h2>
          {upcoming.map((f) => (
            <FixtureCard key={f.id} fixture={f} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Past</h2>
          {past.map((f) => (
            <FixtureCard key={f.id} fixture={f} />
          ))}
        </div>
      )}
    </div>
  );
}
