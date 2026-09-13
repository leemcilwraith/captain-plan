export interface Contact {
  id: string;
  name: string;
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
  template: EmailTemplate;
}

export interface AppState {
  teams: Team[];
  umpires: Umpire[];
  venues: Venue[];
  fixtures: Fixture[];
  settings: Settings;
}
