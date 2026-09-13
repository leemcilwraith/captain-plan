"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createId } from "./id";
import { DEFAULT_TEMPLATE } from "./template";
import type { AppState, Contact, Fixture, ImportSummary, SeedData, Settings, Team, Umpire, Venue } from "./types";

interface StoreActions {
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  addTeam: (team: Omit<Team, "id" | "contacts">) => string;
  updateTeam: (id: string, patch: Partial<Omit<Team, "id" | "contacts">>) => void;
  deleteTeam: (id: string) => void;

  addContact: (teamId: string, contact: Omit<Contact, "id">) => void;
  addContactsBulk: (teamId: string, emails: string[]) => void;
  updateContact: (teamId: string, contactId: string, patch: Partial<Omit<Contact, "id">>) => void;
  deleteContact: (teamId: string, contactId: string) => void;

  addUmpire: (umpire: Omit<Umpire, "id">) => void;
  updateUmpire: (id: string, patch: Partial<Omit<Umpire, "id">>) => void;
  deleteUmpire: (id: string) => void;

  addVenue: (venue: Omit<Venue, "id">) => string;
  updateVenue: (id: string, patch: Partial<Omit<Venue, "id">>) => void;
  deleteVenue: (id: string) => void;

  addFixture: (fixture: Omit<Fixture, "id">) => string;
  updateFixture: (id: string, patch: Partial<Omit<Fixture, "id">>) => void;
  deleteFixture: (id: string) => void;
  markFixtureEmailGenerated: (id: string) => void;

  updateSettings: (patch: Partial<Settings>) => void;

  importSeedData: (data: SeedData) => ImportSummary;
}

type Store = AppState & StoreActions;

const defaultSettings: Settings = {
  clubName: "",
  senderName: "",
  defaultVenueId: undefined,
  kit: "",
  clubhouse: "",
  template: DEFAULT_TEMPLATE,
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      teams: [],
      umpires: [],
      venues: [],
      fixtures: [],
      settings: defaultSettings,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addTeam: (team) => {
        const id = createId();
        set((state) => ({ teams: [...state.teams, { ...team, id, contacts: [] }] }));
        return id;
      },
      updateTeam: (id, patch) => {
        set((state) => ({
          teams: state.teams.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }));
      },
      deleteTeam: (id) => {
        set((state) => ({
          teams: state.teams.filter((t) => t.id !== id),
          fixtures: state.fixtures.filter((f) => f.teamId !== id),
        }));
      },

      addContact: (teamId, contact) => {
        const id = createId();
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId ? { ...t, contacts: [...t.contacts, { ...contact, id }] } : t
          ),
        }));
      },
      addContactsBulk: (teamId, emails) => {
        const newContacts = emails
          .map((e) => e.trim())
          .filter(Boolean)
          .map((email) => ({ id: createId(), email }));
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId ? { ...t, contacts: [...t.contacts, ...newContacts] } : t
          ),
        }));
      },
      updateContact: (teamId, contactId, patch) => {
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId
              ? {
                  ...t,
                  contacts: t.contacts.map((c) => (c.id === contactId ? { ...c, ...patch } : c)),
                }
              : t
          ),
        }));
      },
      deleteContact: (teamId, contactId) => {
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId ? { ...t, contacts: t.contacts.filter((c) => c.id !== contactId) } : t
          ),
        }));
      },

      addUmpire: (umpire) => {
        set((state) => ({ umpires: [...state.umpires, { ...umpire, id: createId() }] }));
      },
      updateUmpire: (id, patch) => {
        set((state) => ({
          umpires: state.umpires.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        }));
      },
      deleteUmpire: (id) => {
        set((state) => ({
          umpires: state.umpires.filter((u) => u.id !== id),
          fixtures: state.fixtures.map((f) => ({
            ...f,
            umpireIds: f.umpireIds.filter((uid) => uid !== id),
          })),
        }));
      },

      addVenue: (venue) => {
        const id = createId();
        set((state) => ({ venues: [...state.venues, { ...venue, id }] }));
        return id;
      },
      updateVenue: (id, patch) => {
        set((state) => ({
          venues: state.venues.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        }));
      },
      deleteVenue: (id) => {
        set((state) => ({
          venues: state.venues.filter((v) => v.id !== id),
          fixtures: state.fixtures.map((f) => (f.venueId === id ? { ...f, venueId: undefined } : f)),
        }));
      },

      addFixture: (fixture) => {
        const id = createId();
        set((state) => ({ fixtures: [...state.fixtures, { ...fixture, id }] }));
        return id;
      },
      updateFixture: (id, patch) => {
        set((state) => ({
          fixtures: state.fixtures.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        }));
      },
      deleteFixture: (id) => {
        set((state) => ({ fixtures: state.fixtures.filter((f) => f.id !== id) }));
      },
      markFixtureEmailGenerated: (id) => {
        set((state) => ({
          fixtures: state.fixtures.map((f) =>
            f.id === id ? { ...f, emailGeneratedAt: new Date().toISOString() } : f
          ),
        }));
      },

      updateSettings: (patch) => {
        set((state) => ({ settings: { ...state.settings, ...patch } }));
      },

      importSeedData: (data) => {
        const summary: ImportSummary = { teamsAdded: 0, contactsAdded: 0, umpiresAdded: 0, venuesAdded: 0 };

        set((state) => {
          let teams = state.teams;
          for (const seedTeam of data.teams ?? []) {
            const teamName = seedTeam.name.trim();
            if (!teamName) continue;
            const nameKey = teamName.toLowerCase();
            let team = teams.find((t) => t.name.trim().toLowerCase() === nameKey);
            if (!team) {
              team = { id: createId(), name: teamName, contacts: [] };
              teams = [...teams, team];
              summary.teamsAdded += 1;
            }
            const existingEmails = new Set(team.contacts.map((c) => c.email.toLowerCase()));
            const newContacts: Contact[] = (seedTeam.contacts ?? [])
              .filter((c) => c.email?.trim() && !existingEmails.has(c.email.trim().toLowerCase()))
              .map((c) => ({
                id: createId(),
                name: c.name?.trim() || undefined,
                email: c.email.trim(),
                phone: c.phone?.trim() || undefined,
                role: c.role?.trim() || undefined,
              }));
            if (newContacts.length) {
              summary.contactsAdded += newContacts.length;
              const teamId = team.id;
              teams = teams.map((t) => (t.id === teamId ? { ...t, contacts: [...t.contacts, ...newContacts] } : t));
            }
          }

          let umpires = state.umpires;
          for (const seedUmpire of data.umpires ?? []) {
            const name = seedUmpire.name.trim();
            if (!name) continue;
            const nameKey = name.toLowerCase();
            const emailKey = seedUmpire.email?.trim().toLowerCase();
            const exists = umpires.some(
              (u) => u.name.trim().toLowerCase() === nameKey || (emailKey && u.email?.toLowerCase() === emailKey)
            );
            if (!exists) {
              umpires = [
                ...umpires,
                { id: createId(), name, email: seedUmpire.email?.trim() || undefined, phone: seedUmpire.phone?.trim() || undefined },
              ];
              summary.umpiresAdded += 1;
            }
          }

          let venues = state.venues;
          for (const seedVenue of data.venues ?? []) {
            const name = seedVenue.name.trim();
            if (!name) continue;
            const nameKey = name.toLowerCase();
            const exists = venues.some((v) => v.name.trim().toLowerCase() === nameKey);
            if (!exists) {
              venues = [
                ...venues,
                {
                  id: createId(),
                  name,
                  address: seedVenue.address?.trim() || undefined,
                  parkingInfo: seedVenue.parkingInfo?.trim() || undefined,
                },
              ];
              summary.venuesAdded += 1;
            }
          }

          return { teams, umpires, venues };
        });

        return summary;
      },
    }),
    {
      name: "captain-plan-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => {
        const { hasHydrated: _hasHydrated, setHasHydrated: _setHasHydrated, ...rest } = state;
        void _hasHydrated;
        void _setHasHydrated;
        return rest;
      },
    }
  )
);
