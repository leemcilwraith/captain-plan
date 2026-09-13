"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatShortDate, formatTime12h } from "@/lib/date";
import { buildMailtoUrl, openMailto } from "@/lib/mailto";
import { buildTemplateData, renderEmail } from "@/lib/template";
import type { Fixture } from "@/lib/types";
import FixtureForm from "./FixtureForm";

export default function FixtureCard({ fixture }: { fixture: Fixture }) {
  const teams = useStore((s) => s.teams);
  const venues = useStore((s) => s.venues);
  const umpires = useStore((s) => s.umpires);
  const settings = useStore((s) => s.settings);
  const deleteFixture = useStore((s) => s.deleteFixture);
  const markFixtureEmailGenerated = useStore((s) => s.markFixtureEmailGenerated);
  const [editing, setEditing] = useState(false);

  const team = teams.find((t) => t.id === fixture.teamId);
  const venue = venues.find((v) => v.id === fixture.venueId);
  const fixtureUmpires = umpires.filter((u) => fixture.umpireIds.includes(u.id));
  const availableContacts = team?.contacts ?? [];
  const recipients = availableContacts.filter(
    (c) => fixture.contactIds.length === 0 || fixture.contactIds.includes(c.id)
  );
  const recipientEmails = recipients.map((c) => c.email).filter(Boolean);

  if (editing) {
    return <FixtureForm initial={fixture} onDone={() => setEditing(false)} />;
  }

  function handleGenerateEmail() {
    if (!team) return;
    const data = buildTemplateData({
      fixture,
      team,
      venue,
      umpires: fixtureUmpires,
      contacts: recipients,
      settings,
    });
    const email = renderEmail(settings.template, data);
    const url = buildMailtoUrl({ to: recipientEmails, subject: email.subject, body: email.body });
    openMailto(url);
    markFixtureEmailGenerated(fixture.id);
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {formatShortDate(fixture.date)} · {formatTime12h(fixture.time)}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 ${
                fixture.isHome ? "bg-pitch-100 text-pitch-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {fixture.isHome ? "Home" : "Away"}
            </span>
          </p>
          <h3 className="text-lg font-semibold">
            {team?.name ?? "Unknown team"}
          </h3>
          {venue && <p className="text-sm text-slate-500">{venue.name}</p>}
          {fixtureUmpires.length > 0 && (
            <p className="text-sm text-slate-500">Umpires: {fixtureUmpires.map((u) => u.name).join(" & ")}</p>
          )}
          {fixture.notes && <p className="mt-1 text-sm text-slate-500">{fixture.notes}</p>}
          {fixture.emailGeneratedAt && (
            <p className="mt-1 text-xs text-pitch-600">
              Email generated {new Date(fixture.emailGeneratedAt).toLocaleString("en-GB")}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <button className="btn-secondary" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button
            className="btn-danger"
            onClick={() => {
              if (confirm("Delete this fixture?")) deleteFixture(fixture.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {fixture.isHome && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <button
            className="btn-primary w-full"
            disabled={recipientEmails.length === 0}
            title={recipientEmails.length === 0 ? "Add an email contact for this team first" : undefined}
            onClick={handleGenerateEmail}
          >
            ✉️ Generate email
          </button>
          {recipientEmails.length === 0 && (
            <p className="mt-1 text-center text-xs text-slate-400">
              Add an email contact for {team?.name ?? "this team"} to enable this.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
