import Link from "next/link";

export default function GuidePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">How to use Captain Plan</h1>

      <div className="card space-y-3">
        <h2 className="text-lg font-semibold text-pitch-700">1. First-time setup</h2>
        <p className="text-sm text-slate-500">Do this once at the start of the season, in this order:</p>
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>
            <Link href="/teams" className="font-medium text-pitch-700 underline">
              Add opposition teams
            </Link>{" "}
            and their contacts, pulled from GMS / whostheumpire.com. Use <strong>+ Paste emails</strong> to add
            several contacts to a team at once, or use <strong>Import / backup data</strong> on the Guide/Settings
            page to load a whole season&apos;s worth of teams, contacts, umpires and venues from a single JSON file in
            one go.
          </li>
          <li>
            <Link href="/venues" className="font-medium text-pitch-700 underline">
              Add your home venue(s)
            </Link>
            , with the ground name, address and parking instructions - these drop straight into the email later.
          </li>
          <li>
            <Link href="/umpires" className="font-medium text-pitch-700 underline">
              Add umpires
            </Link>
            . You don&apos;t need the full list up front - keep adding to it through the season as you book new ones.
          </li>
          <li>
            <Link href="/settings" className="font-medium text-pitch-700 underline">
              Set your club details
            </Link>{" "}
            in Settings: club name, your name (used in the sign-off), kit colours, clubhouse/showers location, and
            a default home venue. Skip these and the matching {"{{variables}}"} just come out blank in the email.
          </li>
          <li>
            <Link href="/settings" className="font-medium text-pitch-700 underline">
              Tweak the email template
            </Link>
            . Tap a variable chip to insert it into the subject or body wherever your cursor is, and check the live
            preview at the bottom before saving.
          </li>
        </ol>
      </div>

      <div className="card space-y-3">
        <h2 className="text-lg font-semibold text-pitch-700">2. Every week you play at home</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>
            Add (or check) the{" "}
            <Link href="/" className="font-medium text-pitch-700 underline">
              fixture
            </Link>{" "}
            for that match: date, pushback time, opposition and venue.
          </li>
          <li>
            Check GMS / whostheumpire.com for that game&apos;s umpires, then edit the fixture to select them.
          </li>
          <li>
            If the opposition team has more than one contact, tick/untick who should actually get this fixture&apos;s
            email - it defaults to everyone on file for that team.
          </li>
          <li>
            Tap <strong>Generate email</strong>. This opens a pre-filled draft in your phone&apos;s mail app - it does{" "}
            <strong>not</strong> send automatically, so give it a once-over and hit send yourself.
          </li>
        </ol>
      </div>

      <div className="card space-y-3">
        <h2 className="text-lg font-semibold text-pitch-700">Good to know</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm">
          <li>
            <strong>Away fixtures</strong> can be logged for your own record, but won&apos;t show a Generate Email
            button - emailing for an away game is the opposition&apos;s job.
          </li>
          <li>
            <strong>Nothing syncs between devices.</strong> Everything is stored only in the browser you&apos;re using.
            If you also open the app on another phone/tablet, it starts empty - use{" "}
            <Link href="/settings" className="font-medium text-pitch-700 underline">
              Export backup / Import
            </Link>{" "}
            in Settings to move data across, and it&apos;s worth exporting a backup every so often in case your
            browser&apos;s storage ever gets cleared.
          </li>
          <li>
            <strong>Add it to your home screen</strong> from your phone browser&apos;s menu, so it opens like a normal
            app icon rather than a browser tab.
          </li>
          <li>Deleting anything - a fixture, team, contact, umpire or venue - always asks you to confirm first.</li>
        </ul>
      </div>
    </div>
  );
}
