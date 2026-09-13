"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Contact, Team } from "@/lib/types";

function ContactForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Contact>;
  onSave: (contact: Omit<Contact, "id">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [role, setRole] = useState(initial?.role ?? "");

  return (
    <form
      className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim()) return;
        onSave({ name: name.trim() || undefined, email: email.trim(), phone: phone.trim() || undefined, role: role.trim() || undefined });
      }}
    >
      <div className="col-span-2 sm:col-span-1">
        <label>Name (optional)</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full" />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label>Phone (optional)</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full" />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label>Role (optional)</label>
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Fixtures secretary" className="w-full" />
      </div>
      <div className="col-span-2 flex gap-2">
        <button type="submit" className="btn-primary">Save contact</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function BulkContactForm({
  onSave,
  onCancel,
}: {
  onSave: (emails: string[]) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState("");

  return (
    <form
      className="mt-2 space-y-2 rounded-lg bg-slate-50 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        const emails = text.split(/[\s,;]+/).filter(Boolean);
        if (emails.length === 0) return;
        onSave(emails);
      }}
    >
      <label>Paste one or more email addresses (comma or newline separated)</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="w-full"
        placeholder="alex@example.com, jamie@example.com"
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Add contacts</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function TeamCard({ team }: { team: Team }) {
  const updateTeam = useStore((s) => s.updateTeam);
  const deleteTeam = useStore((s) => s.deleteTeam);
  const addContact = useStore((s) => s.addContact);
  const addContactsBulk = useStore((s) => s.addContactsBulk);
  const updateContact = useStore((s) => s.updateContact);
  const deleteContact = useStore((s) => s.deleteContact);

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(team.name);
  const [addMode, setAddMode] = useState<"none" | "single" | "bulk">("none");
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-2">
        {editingName ? (
          <form
            className="flex flex-1 gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              updateTeam(team.id, { name: name.trim() });
              setEditingName(false);
            }}
          >
            <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1" autoFocus />
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" className="btn-secondary" onClick={() => setEditingName(false)}>Cancel</button>
          </form>
        ) : (
          <>
            <h3 className="text-lg font-semibold">{team.name}</h3>
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={() => setEditingName(true)}>Rename</button>
              <button
                className="btn-danger"
                onClick={() => {
                  if (confirm(`Delete ${team.name}? This also removes fixtures against them.`)) {
                    deleteTeam(team.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-3 divide-y divide-slate-100">
        {team.contacts.length === 0 && addMode === "none" && (
          <p className="py-2 text-sm text-slate-400">No contacts yet.</p>
        )}
        {team.contacts.map((contact) =>
          editingContactId === contact.id ? (
            <ContactForm
              key={contact.id}
              initial={contact}
              onSave={(patch) => {
                updateContact(team.id, contact.id, patch);
                setEditingContactId(null);
              }}
              onCancel={() => setEditingContactId(null)}
            />
          ) : (
            <div key={contact.id} className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-medium">
                  {contact.name || contact.email} {contact.role && <span className="font-normal text-slate-400">· {contact.role}</span>}
                </p>
                {contact.name && (
                  <p className="text-slate-500">
                    {contact.email}
                    {contact.phone ? ` · ${contact.phone}` : ""}
                  </p>
                )}
                {!contact.name && contact.phone && <p className="text-slate-500">{contact.phone}</p>}
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => setEditingContactId(contact.id)}>Edit</button>
                <button className="btn-danger" onClick={() => deleteContact(team.id, contact.id)}>Remove</button>
              </div>
            </div>
          )
        )}
      </div>

      {addMode === "single" && (
        <ContactForm
          onSave={(contact) => {
            addContact(team.id, contact);
            setAddMode("none");
          }}
          onCancel={() => setAddMode("none")}
        />
      )}
      {addMode === "bulk" && (
        <BulkContactForm
          onSave={(emails) => {
            addContactsBulk(team.id, emails);
            setAddMode("none");
          }}
          onCancel={() => setAddMode("none")}
        />
      )}
      {addMode === "none" && (
        <div className="mt-3 flex gap-2">
          <button className="btn-secondary" onClick={() => setAddMode("single")}>
            + Add contact
          </button>
          <button className="btn-secondary" onClick={() => setAddMode("bulk")}>
            + Paste emails
          </button>
        </div>
      )}
    </div>
  );
}

export default function TeamsManager() {
  const teams = useStore((s) => s.teams);
  const addTeam = useStore((s) => s.addTeam);
  const [newTeamName, setNewTeamName] = useState("");

  return (
    <div className="space-y-4">
      <form
        className="card flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!newTeamName.trim()) return;
          addTeam({ name: newTeamName.trim() });
          setNewTeamName("");
        }}
      >
        <input
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="Opposition team name"
          className="flex-1"
        />
        <button type="submit" className="btn-primary">Add team</button>
      </form>

      {teams.length === 0 && (
        <p className="text-center text-sm text-slate-400">
          Add the opposition teams you play, along with their fixtures secretary / umpire contacts.
        </p>
      )}

      {[...teams]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
    </div>
  );
}
