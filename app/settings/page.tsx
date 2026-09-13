import Link from "next/link";
import SettingsManager from "@/components/SettingsManager";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Club &amp; email template</h1>
      <p className="mb-4 mt-1 text-sm text-slate-400">
        New here? See the{" "}
        <Link href="/guide" className="text-pitch-600 underline">
          Guide
        </Link>{" "}
        for the full setup order.
      </p>
      <SettingsManager />
    </div>
  );
}
