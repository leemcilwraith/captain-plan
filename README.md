# Captain Plan

A mobile-friendly hockey fixtures app for a team captain. Replaces the old
"spreadsheet + button" workflow: set the fixture, pick the opposition and
umpires, then generate a pre-filled email that opens in your phone's mail
app of choice.

## How it works

- **No login, no server-side database.** Everything - teams, contacts,
  venues, umpires, fixtures, and the email template - is stored in the
  browser's `localStorage`, scoped to whichever device/browser you use it
  on. There's nothing to sign into and nothing to lose access to.
- **Generate email** builds a `mailto:` link from the fixture details and
  opens it, which hands off to the phone's default mail app (or lets the
  user pick one), with the subject/body already filled in - same result as
  the old spreadsheet button.

## Pages

- **Fixtures** (`/`) - list of fixtures, add/edit, and the "Generate email"
  button (home fixtures only).
- **Teams** (`/teams`) - opposition teams and their contacts (name, email,
  phone, role) - the info you'd otherwise pull from GMS / whostheumpire.com.
- **Umpires** (`/umpires`) - your pool of umpires to assign to fixtures.
- **Venues** (`/venues`) - your home ground(s), with address and parking
  info.
- **Email template** (`/settings`) - club name, your sign-off name, default
  venue, kit colours, clubhouse/showers location, and an editable
  subject/body template with tap-to-insert variables ({{date}},
  {{pushbackTime}}, {{venue}}, {{parkingInfo}}, {{oppositionTeam}},
  {{oppositionContact}}, {{umpires}}, {{clubName}}, {{senderName}},
  {{kit}}, {{clubhouse}}), plus a live preview. The default template is
  based on Lee's existing wording, converted to plain text.
- **Guide** (`/guide`) - in-app walkthrough: first-time setup order, the
  weekly matchday routine, and a "good to know" list (away fixtures, no
  cross-device sync, backups, add-to-home-screen). The same tips are
  echoed as short hints in each page's empty state.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploying to Vercel

This is a static export (`output: "export"` in `next.config.mjs`) - there's
no server-side code, API routes, or middleware, so it deploys as plain
static files:

1. Push this repo to GitHub.
2. Import it in Vercel (vercel.com/new).
3. No environment variables or build configuration are required - Vercel
   auto-detects Next.js and runs `next build`.

Because all data lives in the browser, each user/device builds up its own
set of teams, venues, umpires and fixtures the first time they use the app
- there's no shared backend to seed.

## Notes on data

- Deleting a team also removes any fixtures scheduled against it; deleting
  a venue/umpire just unlinks it from existing fixtures.
- "Generate email" is only available for **home** fixtures, and only once
  the opposition team has at least one contact with an email address.
- Clearing your browser's site data (or switching browser/device) clears
  this app's data, since nothing is synced to a server.
- Team contacts don't need a name - a bare email address is enough (the
  Teams page has a "Paste emails" option for adding several at once,
  matching how contacts were often just a list of raw addresses in the
  old spreadsheet). If a contact has no name, their email is used in the
  `{{oppositionContact}}` variable instead.
- `mailto:` links only support plain text, so the email template can't use
  HTML formatting (bold, `<br>` tags) - the default template is a plain-text
  version of the original spreadsheet's wording.
- Out of scope (not carried over from the old spreadsheet): the
  goals/cards/appearances tracker and the "player of the season" form -
  this app is scoped to fixtures and the email workflow only.
