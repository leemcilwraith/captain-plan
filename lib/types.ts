export interface Contact {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface Team {
  id: string;
  name: string;
  contacts: Contact[];
  notes?: string;
}

export interface Umpire {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Venue {
  id: string;
  name: string;
  address?: string;
  parkingInfo?: string;
}

export interface Fixture {
  id: string;
  date: string; // ISO date, e.g. 2025-09-14
  time: string; // 24h HH:mm
  isHome: boolean;
  teamId: string;
  venueId?: string;
  umpireIds: string[];
  contactIds: string[]; // subset of the team's contacts to email; empty = all
  notes?: string;
  emailGeneratedAt?: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface Settings {
  clubName: string;
  senderName: string;
  defaultVenueId?: string;
  kit?: string; // e.g. "white shirts, black shorts and white socks"
  clubhouse?: string; // shower/clubhouse location, constant across home venues
  template: EmailTemplate;
}

export interface AppState {
  teams: Team[];
  umpires: Umpire[];
  venues: Venue[];
  fixtures: Fixture[];
  settings: Settings;
}

// Shape for bulk-importing starter data (e.g. contacts already gathered in a
// spreadsheet). Import is additive/deduped by name or email - it never
// overwrites or removes existing records.
export interface SeedContact {
  name?: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface SeedTeam {
  name: string;
  contacts?: SeedContact[];
}

export interface SeedUmpire {
  name: string;
  email?: string;
  phone?: string;
}

export interface SeedVenue {
  name: string;
  address?: string;
  parkingInfo?: string;
}

export interface SeedData {
  teams?: SeedTeam[];
  umpires?: SeedUmpire[];
  venues?: SeedVenue[];
}

export interface ImportSummary {
  teamsAdded: number;
  contactsAdded: number;
  umpiresAdded: number;
  venuesAdded: number;
}
