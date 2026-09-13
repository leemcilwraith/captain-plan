import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import HydrationBoundary from "@/components/HydrationBoundary";

export const metadata: Metadata = {
  title: "Captain Plan",
  description: "Plan hockey fixtures and generate umpire/venue emails on the go.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Captain Plan",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f9d58",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <Nav />
        <main className="mx-auto max-w-3xl px-4 py-6 pb-16">
          <HydrationBoundary>{children}</HydrationBoundary>
        </main>
      </body>
    </html>
  );
}
