"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Fixtures" },
  { href: "/teams", label: "Teams" },
  { href: "/umpires", label: "Umpires" },
  { href: "/venues", label: "Venues" },
  { href: "/settings", label: "Email template" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-1 overflow-x-auto px-3 py-2">
        <span className="mr-2 shrink-0 text-lg font-bold text-pitch-700">🏑 Captain Plan</span>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${
                active ? "bg-pitch-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
