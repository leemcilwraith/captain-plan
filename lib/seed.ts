import type { SeedContact, SeedData, SeedTeam, SeedUmpire, SeedVenue } from "./types";

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function parseContact(v: unknown): SeedContact | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const email = str(o.email);
  if (!email) return null;
  return { email, name: str(o.name), phone: str(o.phone), role: str(o.role) };
}

function parseTeam(v: unknown): SeedTeam | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const name = str(o.name);
  if (!name) return null;
  const contacts = Array.isArray(o.contacts)
    ? o.contacts.map(parseContact).filter((c): c is SeedContact => c !== null)
    : undefined;
  return { name, contacts };
}

function parseUmpire(v: unknown): SeedUmpire | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const name = str(o.name);
  if (!name) return null;
  return { name, email: str(o.email), phone: str(o.phone) };
}

function parseVenue(v: unknown): SeedVenue | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const name = str(o.name);
  if (!name) return null;
  return { name, address: str(o.address), parkingInfo: str(o.parkingInfo) };
}

export function parseSeedData(input: unknown): SeedData {
  if (!input || typeof input !== "object") {
    throw new Error("Expected a JSON object with teams/umpires/venues arrays.");
  }
  const raw = input as Record<string, unknown>;
  return {
    teams: Array.isArray(raw.teams) ? raw.teams.map(parseTeam).filter((t): t is SeedTeam => t !== null) : undefined,
    umpires: Array.isArray(raw.umpires)
      ? raw.umpires.map(parseUmpire).filter((u): u is SeedUmpire => u !== null)
      : undefined,
    venues: Array.isArray(raw.venues)
      ? raw.venues.map(parseVenue).filter((v): v is SeedVenue => v !== null)
      : undefined,
  };
}
