"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { buildTemplateData, renderEmail, TEMPLATE_VARIABLES } from "@/lib/template";
import type { Contact, Fixture, Team, Umpire, Venue } from "@/lib/types";

const SAMPLE_FIXTURE: Fixture = {
  id: "sample",
  date: new Date().toISOString().slice(0, 10),
  time: "14:00",
  isHome: true,
  teamId: "sample-team",
  venueId: "sample-venue",
  umpireIds: [],
  contactIds: [],
};

const SAMPLE_TEAM: Team = { id: "sample-team", name: "Oakwood Hockey Club", contacts: [] };
const SAMPLE_VENUE: Venue = {
  id: "sample-venue",
  name: "Riverside Astro",
  address: "12 River Lane, Riverside",
  parkingInfo: "Use the main car park off River Lane, not the school entrance.",
};
const SAMPLE_UMPIRES: Umpire[] = [{ id: "u1", name: "Pat Jones" }, { id: "u2", name: "Sam Lee" }];
const SAMPLE_CONTACTS: Contact[] = [{ id: "c1", name: "Alex Carter", email: "alex@example.com" }];

type ActiveField = "subject" | "body";

export default function SettingsManager() {
  const settings = useStore((s) => s.settings);
  const venues = useStore((s) => s.venues);
  const updateSettings = useStore((s) => s.updateSettings);

  const [clubName, setClubName] = useState(settings.clubName);
  const [senderName, setSenderName] = useState(settings.senderName);
  const [defaultVenueId, setDefaultVenueId] = useState(settings.defaultVenueId ?? "");
  const [subject, setSubject] = useState(settings.template.subject);
  const [body, setBody] = useState(settings.template.body);
  const [activeField, setActiveField] = useState<ActiveField>("body");
  const [saved, setSaved] = useState(false);

  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  function insertVariable(key: string) {
    const token = `{{${key}}}`;
    const ref = activeField === "subject" ? subjectRef.current : bodyRef.current;
    const current = activeField === "subject" ? subject : body;
    const setValue = activeField === "subject" ? setSubject : setBody;

    if (!ref) {
      setValue(current + token);
      return;
    }
    const start = ref.selectionStart ?? current.length;
    const end = ref.selectionEnd ?? current.length;
    const next = current.slice(0, start) + token + current.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      ref.focus();
      const cursor = start + token.length;
      ref.setSelectionRange(cursor, cursor);
    });
  }

  function save() {
    updateSettings({
      clubName: clubName.trim(),
      senderName: senderName.trim(),
      defaultVenueId: defaultVenueId || undefined,
      template: { subject, body },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const previewData = buildTemplateData({
    fixture: SAMPLE_FIXTURE,
    team: SAMPLE_TEAM,
    venue: venues.find((v) => v.id === defaultVenueId) ?? SAMPLE_VENUE,
    umpires: SAMPLE_UMPIRES,
    contacts: SAMPLE_CONTACTS,
    settings: { clubName: clubName || "Your Hockey Club", senderName: senderName || "Your Name", template: { subject, body } },
  });
  const preview = renderEmail({ subject, body }, previewData);

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <h2 className="text-sm font-semibold text-slate-500">Club details</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label>Club / team name</label>
            <input value={clubName} onChange={(e) => setClubName(e.target.value)} className="w-full" />
          </div>
          <div>
            <label>Your name (for sign-off)</label>
            <input value={senderName} onChange={(e) => setSenderName(e.target.value)} className="w-full" />
          </div>
          <div className="sm:col-span-2">
            <label>Default home venue</label>
            <select value={defaultVenueId} onChange={(e) => setDefaultVenueId(e.target.value)} className="w-full">
              <option value="">No default</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card space-y-3">
        <h2 className="text-sm font-semibold text-slate-500">Email template</h2>
        <p className="text-xs text-slate-400">
          Tap a variable to insert it into the subject or body at your cursor.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TEMPLATE_VARIABLES.map((v) => (
            <button
              key={v.key}
              type="button"
              title={v.description}
              className="rounded-full bg-pitch-50 px-2.5 py-1 text-xs font-medium text-pitch-700 hover:bg-pitch-100"
              onClick={() => insertVariable(v.key)}
            >
              {`{{${v.key}}}`}
            </button>
          ))}
        </div>

        <div>
          <label>Subject</label>
          <input
            ref={subjectRef}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onFocus={() => setActiveField("subject")}
            className="w-full"
          />
        </div>
        <div>
          <label>Body</label>
          <textarea
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onFocus={() => setActiveField("body")}
            rows={10}
            className="w-full font-mono text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-primary" onClick={save}>
            Save template
          </button>
          {saved && <span className="text-sm text-pitch-600">Saved ✓</span>}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-2 text-sm font-semibold text-slate-500">Preview (sample fixture)</h2>
        <p className="mb-1 text-sm font-semibold">{preview.subject}</p>
        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">{preview.body}</pre>
      </div>
    </div>
  );
}
