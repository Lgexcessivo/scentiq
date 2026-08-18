"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-charcoal-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-lg text-gold-400">
          ScentIQ
        </Link>
        <nav className="flex gap-2">
          <Link href="/" className={`chip ${pathname === "/" ? "chip-selected" : ""}`}>
            Recomendação
          </Link>
          <Link href="/catalogo" className={`chip ${pathname === "/catalogo" ? "chip-selected" : ""}`}>
            Catálogo
          </Link>
        </nav>
      </div>
    </header>
  );
}
