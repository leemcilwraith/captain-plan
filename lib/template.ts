import { formatLongDate, formatTime12h } from "./date";
import type { Contact, EmailTemplate, Fixture, Settings, Team, Umpire, Venue } from "./types";

export interface TemplateVariable {
  key: string;
  label: string;
  description: string;
}

export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  { key: "oppositionTeam", label: "Opposition team", description: "Name of the visiting team" },
  { key: "oppositionContact", label: "Opposition contact", description: "Name(s) of the contact(s) being emailed" },
  { key: "date", label: "Date", description: "Fixture date, e.g. Sunday 14 September 2025" },
  { key: "pushbackTime", label: "Pushback time", description: "Kick-off / pushback time, e.g. 2pm" },
  { key: "venue", label: "Venue", description: "Name of the ground" },
  { key: "address", label: "Address", description: "Venue address" },
  { key: "parkingInfo", label: "Parking info", description: "Parking instructions for the venue" },
  { key: "umpires", label: "Umpires", description: "Names of the umpires set for the game" },
  { key: "clubName", label: "Club name", description: "Your club/team name" },
  { key: "senderName", label: "Your name", description: "Your name, for the sign-off" },
  { key: "kit", label: "Kit colours", description: "Your team's playing kit, e.g. white shirts, black shorts and white socks" },
  { key: "clubhouse", label: "Clubhouse / showers", description: "Shower and clubhouse location, constant across your home venues" },
];

export function buildTemplateData(params: {
  fixture: Fixture;
  team: Team | undefined;
  venue: Venue | undefined;
  umpires: Umpire[];
  contacts: Contact[];
  settings: Settings;
}): Record<string, string> {
  const { fixture, team, venue, umpires, contacts, settings } = params;

  const umpireNames = umpires.length
    ? umpires.map((u) => u.name).join(" & ")
    : "TBC";

  const contactNames = contacts.length
    ? contacts.map((c) => c.name?.trim() || c.email).join(", ")
    : "there";

  return {
    oppositionTeam: team?.name ?? "",
    oppositionContact: contactNames,
    date: formatLongDate(fixture.date),
    pushbackTime: formatTime12h(fixture.time),
    venue: venue?.name ?? "",
    address: venue?.address ?? "",
    parkingInfo: venue?.parkingInfo ?? "",
    umpires: umpireNames,
    clubName: settings.clubName,
    senderName: settings.senderName,
    kit: settings.kit ?? "",
    clubhouse: settings.clubhouse ?? "",
  };
}

export function renderTemplate(text: string, data: Record<string, string>): string {
  return text.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (match, key) => {
    return key in data ? data[key] : match;
  });
}

export function renderEmail(template: EmailTemplate, data: Record<string, string>): EmailTemplate {
  return {
    subject: renderTemplate(template.subject, data),
    body: renderTemplate(template.body, data),
  };
}

export const DEFAULT_TEMPLATE: EmailTemplate = {
  subject: "{{clubName}} vs {{oppositionTeam}} - {{date}}",
  body: `Hey all,

Confirming our fixture against {{oppositionTeam}} on {{date}}.

Date: {{date}}
Pushback Time: {{pushbackTime}}
Match Location: {{venue}}
Match Parking: {{parkingInfo}}
Shower / Clubhouse Location: {{clubhouse}}

We will be playing in {{kit}}.

Can you please let me know how many teas you will require and if there are any special dietary requirements by Thursday morning please.

Umpires: {{umpires}}
Could you also let me know if you are planning to stay for post-match teas and if either of you have any dietary requirements by Thursday morning please.

I look forward to seeing you all on {{date}}.
Any questions before then, just ask.

Regards,
{{senderName}}
{{clubName}}`,
};
