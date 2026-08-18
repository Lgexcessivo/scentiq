"use client";

import { useMemo, useState } from "react";
import { PERFUMES } from "@/data/perfumes";
import { NOTE_MAP, FAMILY_LABELS } from "@/data/notes";
import { Gender, OlfactoryFamily, Perfume } from "@/types/perfume";
import { normalize } from "@/lib/textParser";
import CatalogCard from "./CatalogCard";
import CatalogModal from "./CatalogModal";

const FAMILIES = Object.keys(FAMILY_LABELS) as OlfactoryFamily[];

// Busca por nome, marca, descrição ou qualquer nota do perfume — tudo sem
// acento e sem diferenciar maiúscula/minúscula, pra ser tolerante com como
// a pessoa digitar.
function matchesSearch(perfume: Perfume, query: string): boolean {
  if (!query.trim()) return true;
  const haystack = [
    perfume.name,
    perfume.brand,
    perfume.description,
    ...perfume.notesTop.map((n) => NOTE_MAP[n]?.label ?? n),
    ...perfume.notesHeart.map((n) => NOTE_MAP[n]?.label ?? n),
    ...perfume.notesBase.map((n) => NOTE_MAP[n]?.label ?? n),
  ]
    .map(normalize)
    .join(" ");
  return haystack.includes(normalize(query));
}

export default function CatalogBrowser() {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<Gender | "todos">("todos");
  const [familyFilter, setFamilyFilter] = useState<OlfactoryFamily | "todas">("todas");
  const [sortBy, setSortBy] = useState<"nome" | "preco-menor" | "preco-maior">("nome");
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");
  const [selected, setSelected] = useState<Perfume | null>(null);

  const filtered = useMemo(() => {
    let list = PERFUMES.filter((p) => matchesSearch(p, search));
    if (genderFilter !== "todos") list = list.filter((p) => p.gender === genderFilter);
    if (familyFilter !== "todas") list = list.filter((p) => p.family.includes(familyFilter));

    return [...list].sort((a, b) => {
      if (sortBy === "nome") return a.name.localeCompare(b.name);
      const priceA = currency === "BRL" ? a.priceBRL : a.priceUSD;
      const priceB = currency === "BRL" ? b.priceBRL : b.priceUSD;
      return sortBy === "preco-menor" ? priceA - priceB : priceB - priceA;
    });
  }, [search, genderFilter, familyFilter, sortBy, currency]);

  function clearFilters() {
    setSearch("");
    setGenderFilter("todos");
    setFamilyFilter("todas");
  }

  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
      <div className="text-center mb-10 animate-fade-in">
        <p className="section-label mb-4">Catálogo completo</p>
        <h1 className="font-display text-3xl sm:text-4xl mb-3">Busque direto no catálogo</h1>
        <p className="text-neutral-400 max-w-xl mx-auto">
          Procure por nome, marca ou nota olfativa — sem precisar preencher o formulário de
          recomendação.
        </p>
      </div>

      <div className="glass-card p-5 sm:p-6 mb-8 space-y-4 animate-rise">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, marca ou nota (ex: Sauvage, Dior, baunilha...)"
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-neutral-100 outline-none focus:border-gold-500/60"
        />

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-1.5">
            {(["todos", "masculino", "feminino", "unissex"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`chip ${genderFilter === g ? "chip-selected" : ""}`}
              >
                {g === "todos" ? "Todos" : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>

          <select
            value={familyFilter}
            onChange={(e) => setFamilyFilter(e.target.value as OlfactoryFamily | "todas")}
            className="bg-white/[0.04] border border-white/10 rounded-full px-4 py-1.5 text-sm text-neutral-200 outline-none"
          >
            <option value="todas">Todas as famílias</option>
            {FAMILIES.map((f) => (
              <option key={f} value={f}>
                {FAMILY_LABELS[f]}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white/[0.04] border border-white/10 rounded-full px-4 py-1.5 text-sm text-neutral-200 outline-none"
          >
            <option value="nome">Ordenar por nome</option>
            <option value="preco-menor">Preço: menor primeiro</option>
            <option value="preco-maior">Preço: maior primeiro</option>
          </select>

          <div className="flex gap-1.5 sm:ml-auto">
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
      </div>

      <p className="text-neutral-400 text-sm mb-6">
        {filtered.length} perfume{filtered.length !== 1 ? "s" : ""} encontrado
        {filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 px-6">
          <p className="font-display text-xl mb-2">Nenhum perfume encontrado</p>
          <p className="text-neutral-500 mb-6">Tente mudar a busca ou os filtros.</p>
          <button onClick={clearFilters} className="btn-ghost">
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <CatalogCard key={p.id} perfume={p} currency={currency} onOpenDetails={() => setSelected(p)} />
          ))}
        </div>
      )}

      {selected && <CatalogModal perfume={selected} currency={currency} onClose={() => setSelected(null)} />}
    </section>
  );
}
