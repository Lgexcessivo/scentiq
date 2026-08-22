"use client";

import { useState } from "react";
import { PERFUMES } from "@/data/perfumes";
import { useFavorites } from "@/lib/favorites";
import { Perfume } from "@/types/perfume";
import CatalogCard from "./CatalogCard";
import CatalogModal from "./CatalogModal";

export default function FavoritesBrowser() {
  const { favorites, isFavorite, toggle } = useFavorites();
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");
  const [selected, setSelected] = useState<Perfume | null>(null);

  const favoritePerfumes = PERFUMES.filter((p) => favorites.includes(p.id));

  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
      <div className="text-center mb-10 animate-fade-in">
        <p className="section-label mb-4">Seus favoritos</p>
        <h1 className="font-display text-3xl sm:text-4xl mb-3">Perfumes que você salvou</h1>
        <p className="text-neutral-400 max-w-xl mx-auto">
          Clique no coração de qualquer perfume, na Recomendação ou no Catálogo, para salvar aqui.
          Fica guardado só neste navegador.
        </p>
      </div>

      {favoritePerfumes.length === 0 ? (
        <div className="text-center py-16 px-6">
          <p className="font-display text-xl mb-2">Nenhum favorito ainda</p>
          <p className="text-neutral-500">
            Explore o catálogo ou peça uma recomendação e clique no coração dos perfumes que gostar.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-neutral-400 text-sm">
              {favoritePerfumes.length} perfume{favoritePerfumes.length !== 1 ? "s" : ""} salvo
              {favoritePerfumes.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-1.5">
              {(["BRL", "USD"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`chip ${currency === c ? "chip-selected" : ""}`}
                >
                  {c === "BRL" ? "R$" : "US$"}
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favoritePerfumes.map((p) => (
              <CatalogCard
                key={p.id}
                perfume={p}
                currency={currency}
                onOpenDetails={() => setSelected(p)}
                isFavorite={isFavorite(p.id)}
                onToggleFavorite={() => toggle(p.id)}
              />
            ))}
          </div>
        </>
      )}

      {selected && <CatalogModal perfume={selected} currency={currency} onClose={() => setSelected(null)} />}
    </section>
  );
}
