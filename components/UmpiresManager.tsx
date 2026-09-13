"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type { Umpire } from "@/lib/types";

function UmpireForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Umpire>;
  onSave: (umpire: Omit<Umpire, "id">) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");

  return (
    <form
      className="grid grid-cols-1 gap-2 sm:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({ name: name.trim(), email: email.trim() || undefined, phone: phone.trim() || undefined });
        if (!initial) {
          setName("");
          setEmail("");
          setPhone("");
        }
      }}
    >
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" />
      <div className="flex gap-2">
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" className="flex-1" />
        <button type="submit" className="btn-primary">{initial ? "Save" : "Add"}</button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function UmpiresManager() {
  const umpires = useStore((s) => s.umpires);
  const addUmpire = useStore((s) => s.addUmpire);
  const updateUmpire = useStore((s) => s.updateUmpire);
  const deleteUmpire = useStore((s) => s.deleteUmpire);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="mb-2 text-sm font-semibold text-slate-500">Add umpire</h2>
        <UmpireForm onSave={addUmpire} />
      </div>

      {umpires.length === 0 && (
        <p className="text-center text-sm text-slate-400">
          Add the umpires you regularly book for home games - you can keep adding to this list all season as you
          book new ones. See the{" "}
          <Link href="/guide" className="text-pitch-600 underline">
            Guide
          </Link>{" "}
          for the full setup order.
        </p>
      )}

      <div className="card divide-y divide-slate-100">
        {[...umpires]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((umpire) =>
            editingId === umpire.id ? (
              <div key={umpire.id} className="py-3">
                <UmpireForm
                  initial={umpire}
                  onSave={(patch) => {
                    updateUmpire(umpire.id, patch);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div key={umpire.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{umpire.name}</p>
                  <p className="text-slate-500">
                    {umpire.email}
                    {umpire.phone ? ` · ${umpire.phone}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary" onClick={() => setEditingId(umpire.id)}>Edit</button>
                  <button
                    className="btn-danger"
                    onClick={() => {
                      if (confirm(`Remove ${umpire.name}? This also unassigns them from any fixtures.`)) {
                        deleteUmpire(umpire.id);
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
}
