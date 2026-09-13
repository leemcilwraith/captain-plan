"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type { Venue } from "@/lib/types";

function VenueForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Venue>;
  onSave: (venue: Omit<Venue, "id">) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [parkingInfo, setParkingInfo] = useState(initial?.parkingInfo ?? "");

  return (
    <form
      className="grid grid-cols-1 gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({ name: name.trim(), address: address.trim() || undefined, parkingInfo: parkingInfo.trim() || undefined });
        if (!initial) {
          setName("");
          setAddress("");
          setParkingInfo("");
        }
      }}
    >
      <div>
        <label>Ground name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full" />
      </div>
      <div>
        <label>Address (optional)</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full" />
      </div>
      <div>
        <label>Parking info (optional)</label>
        <textarea value={parkingInfo} onChange={(e) => setParkingInfo(e.target.value)} className="w-full" rows={2} />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">{initial ? "Save" : "Add venue"}</button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function VenuesManager() {
  const venues = useStore((s) => s.venues);
  const addVenue = useStore((s) => s.addVenue);
  const updateVenue = useStore((s) => s.updateVenue);
  const deleteVenue = useStore((s) => s.deleteVenue);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="mb-2 text-sm font-semibold text-slate-500">Add venue</h2>
        <VenueForm onSave={(v) => addVenue(v)} />
      </div>

      {venues.length === 0 && (
        <p className="text-center text-sm text-slate-400">
          Add your home ground(s), including parking instructions to drop straight into emails. See the{" "}
          <Link href="/guide" className="text-pitch-600 underline">
            Guide
          </Link>{" "}
          for the full setup order.
        </p>
      )}

      {[...venues]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((venue) => (
          <div key={venue.id} className="card">
            {editingId === venue.id ? (
              <VenueForm
                initial={venue}
                onSave={(patch) => {
                  updateVenue(venue.id, patch);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{venue.name}</p>
                  {venue.address && <p className="text-sm text-slate-500">{venue.address}</p>}
                  {venue.parkingInfo && <p className="mt-1 text-sm text-slate-500">🅿️ {venue.parkingInfo}</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="btn-secondary" onClick={() => setEditingId(venue.id)}>Edit</button>
                  <button
                    className="btn-danger"
                    onClick={() => {
                      if (confirm(`Remove ${venue.name}? Fixtures using it will keep their date/time but lose the venue link.`)) {
                        deleteVenue(venue.id);
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
