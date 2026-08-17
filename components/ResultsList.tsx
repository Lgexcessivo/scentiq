"use client";

import { useMemo, useState } from "react";
import type { RecommendationResult } from "@/lib/recommendation";
import { Gender } from "@/types/perfume";
import FilterBar from "./FilterBar";
import PerfumeCard from "./PerfumeCard";
import PerfumeModal from "./PerfumeModal";
import EmptyState from "./EmptyState";

interface ResultsListProps {
  results: RecommendationResult[];
  relaxed: boolean;
  currency: "BRL" | "USD";
  onReset: () => void;
  onEditPreferences: () => void;
}

export default function ResultsList({ results, relaxed, currency, onReset, onEditPreferences }: ResultsListProps) {
  const [sortBy, setSortBy] = useState<"compat" | "price">("compat");
  const [genderFilter, setGenderFilter] = useState<Gender | "todos">("todos");
  const [selected, setSelected] = useState<RecommendationResult | null>(null);

  const filtered = useMemo(() => {
    let list = results;
    if (genderFilter !== "todos") {
      list = list.filter((r) => r.perfume.gender === genderFilter);
    }
    return [...list].sort((a, b) => {
      if (sortBy === "compat") return b.score - a.score;
      const priceA = currency === "BRL" ? a.perfume.priceBRL : a.perfume.priceUSD;
      const priceB = currency === "BRL" ? b.perfume.priceBRL : b.perfume.priceUSD;
      return priceA - priceB;
    });
  }, [results, genderFilter, sortBy, currency]);

  return (
    <section className="max-w-6xl mx-auto px-6 pb-24 animate-fade-in">
      {relaxed && (
        <div className="mb-6 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
          Não encontramos perfumes dentro de todos os seus critérios exatos — aqui estão as opções mais
          próximas do que você pediu.
        </div>
      )}

      <FilterBar
        sortBy={sortBy}
        onSortChange={setSortBy}
        genderFilter={genderFilter}
        onGenderChange={setGenderFilter}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <EmptyState onEditPreferences={onEditPreferences} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <PerfumeCard key={r.perfume.id} result={r} currency={currency} onOpenDetails={() => setSelected(r)} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-center mt-12">
        <button onClick={onEditPreferences} className="btn-ghost">
          Alterar preferências
        </button>
        <button onClick={onReset} className="btn-ghost">
          Refazer busca do zero
        </button>
      </div>

      {selected && <PerfumeModal result={selected} currency={currency} onClose={() => setSelected(null)} />}
    </section>
  );
}
