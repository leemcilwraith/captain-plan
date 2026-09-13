"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { parseSeedData } from "@/lib/seed";
import type { ImportSummary } from "@/lib/types";

export default function DataImportExport() {
  const importSeedData = useStore((s) => s.importSeedData);
  const [pasted, setPasted] = useState("");
  const [result, setResult] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function runImport(text: string) {
    setError(null);
    setResult(null);
    try {
      const parsed: unknown = JSON.parse(text);
      const seed = parseSeedData(parsed);
      const summary = importSeedData(seed);
      setResult(summary);
      setPasted("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file - check it's valid JSON.");
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => runImport(String(reader.result ?? ""));
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleExport() {
    const state = useStore.getState();
    const payload = {
      teams: state.teams,
      umpires: state.umpires,
      venues: state.venues,
      fixtures: state.fixtures,
      settings: state.settings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "captain-plan-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card space-y-3">
      <h2 className="text-sm font-semibold text-slate-500">Import / backup data</h2>
      <p className="text-xs text-slate-400">
        Import teams, contacts, umpires and venues from a JSON file - handy for loading in everything you already
        had in a spreadsheet. Existing entries are matched by name/email and left untouched; only new ones are
        added.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
          Choose file to import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFile}
        />
        <button className="btn-secondary" onClick={handleExport}>
          Export backup
        </button>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-slate-500">Or paste JSON directly</summary>
        <div className="mt-2 space-y-2">
          <textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            rows={4}
            className="w-full font-mono text-xs"
            placeholder='{"teams": [...], "umpires": [...], "venues": [...]}'
          />
          <button className="btn-primary" onClick={() => runImport(pasted)} disabled={!pasted.trim()}>
            Import pasted JSON
          </button>
        </div>
      </details>

      {result && (
        <p className="text-sm text-pitch-600">
          Added {result.teamsAdded} team(s), {result.contactsAdded} contact(s), {result.umpiresAdded} umpire(s) and{" "}
          {result.venuesAdded} venue(s). Anything already present was left as-is.
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
