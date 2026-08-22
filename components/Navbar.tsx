"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/lib/favorites";

export default function Navbar() {
  const pathname = usePathname();
  const { favorites } = useFavorites();

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
          <Link href="/favoritos" className={`chip ${pathname === "/favoritos" ? "chip-selected" : ""}`}>
            Favoritos{favorites.length > 0 ? ` (${favorites.length})` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}
