"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Fixture } from "@/lib/types";

export default function FixtureForm({
  initial,
  onDone,
}: {
  initial?: Fixture;
  onDone: () => void;
}) {
  const teams = useStore((s) => s.teams);
  const venues = useStore((s) => s.venues);
  const umpires = useStore((s) => s.umpires);
  const settings = useStore((s) => s.settings);
  const addFixture = useStore((s) => s.addFixture);
  const updateFixture = useStore((s) => s.updateFixture);

  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(initial?.time ?? "14:00");
  const [isHome, setIsHome] = useState(initial?.isHome ?? true);
  const [teamId, setTeamId] = useState(initial?.teamId ?? "");
  const [venueId, setVenueId] = useState(initial?.venueId ?? settings.defaultVenueId ?? "");
  const [umpireIds, setUmpireIds] = useState<string[]>(initial?.umpireIds ?? []);
  const [contactIds, setContactIds] = useState<string[]>(initial?.contactIds ?? []);
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const selectedTeam = teams.find((t) => t.id === teamId);

  function toggleUmpire(id: string) {
    setUmpireIds((prev) => (prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]));
  }
  function toggleContact(id: string) {
    setContactIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time || !teamId) return;
    const payload = { date, time, isHome, teamId, venueId: venueId || undefined, umpireIds, contactIds, notes: notes.trim() || undefined };
    if (initial) {
      updateFixture(initial.id, payload);
    } else {
      addFixture(payload);
    }
    onDone();
  }

  if (teams.length === 0) {
    return (
      <div className="card text-sm text-slate-500">
        Add an opposition team on the <a href="/teams" className="text-pitch-600 underline">Teams</a> page before
        scheduling fixtures.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full" />
        </div>
        <div>
          <label>Pushback time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="w-full" />
        </div>
      </div>

      <div>
        <label>Fixture type</label>
        <div className="flex gap-2">
          <button
            type="button"
            className={isHome ? "btn-primary" : "btn-secondary"}
            onClick={() => setIsHome(true)}
          >
            Home
          </button>
          <button
            type="button"
            className={!isHome ? "btn-primary" : "btn-secondary"}
            onClick={() => setIsHome(false)}
          >
            Away
          </button>
        </div>
      </div>

      <div>
        <label>Opposition</label>
        <select value={teamId} onChange={(e) => { setTeamId(e.target.value); setContactIds([]); }} required className="w-full">
          <option value="" disabled>
            Select opposition
          </option>
          {[...teams].sort((a, b) => a.name.localeCompare(b.name)).map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {isHome && (
        <div>
          <label>Venue</label>
          <select value={venueId} onChange={(e) => setVenueId(e.target.value)} className="w-full">
            <option value="">Select venue</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {isHome && selectedTeam && (
        <div>
          <label>Email these contacts</label>
          {selectedTeam.contacts.length === 0 ? (
            <p className="text-sm text-slate-400">
              This team has no contacts yet - add one on the Teams page to enable email generation.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedTeam.contacts.map((c) => (
                <label key={c.id} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={contactIds.length === 0 || contactIds.includes(c.id)}
                    onChange={() => toggleContact(c.id)}
                    className="w-auto"
                  />
                  {c.name || c.email}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <label>Umpires</label>
        {umpires.length === 0 ? (
          <p className="text-sm text-slate-400">
            No umpires added yet - add some on the Umpires page.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {umpires.map((u) => (
              <label key={u.id} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm">
                <input type="checkbox" checked={umpireIds.includes(u.id)} onChange={() => toggleUmpire(u.id)} className="w-auto" />
                {u.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label>Notes (optional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full" />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn-primary">
          {initial ? "Save fixture" : "Add fixture"}
        </button>
        <button type="button" className="btn-secondary" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}
