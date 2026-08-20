"use client";

import { useEffect } from "react";
import type { RecommendationResult } from "@/lib/recommendation";
import { FAMILY_LABELS, NOTE_MAP, OCCASIONS, SEASONS } from "@/data/notes";
import PerfumeIcon from "./PerfumeIcon";

interface PerfumeModalProps {
  result: RecommendationResult;
  currency: "BRL" | "USD";
  onClose: () => void;
}

function noteLabels(ids: string[]) {
  return ids.map((id) => NOTE_MAP[id]?.label ?? id).join(", ");
}

export default function PerfumeModal({ result, currency, onClose }: PerfumeModalProps) {
  const { perfume, score, noteSimilarity, reasons, overBudget, breakdown, penalty } = result;
  const price = currency === "BRL" ? perfume.priceBRL : perfume.priceUSD;
  const priceLabel = currency === "BRL" ? `R$ ${price}` : `US$ ${price}`;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-24 shrink-0">
              {perfume.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={perfume.image}
                  alt={`${perfume.brand} ${perfume.name}`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <PerfumeIcon family={perfume.family} />
              )}
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">{perfume.brand}</p>
              <h2 className="font-display text-2xl">{perfume.name}</h2>
              <p className="text-neutral-400 text-sm capitalize">{perfume.gender}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100 text-2xl leading-none">
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/[0.03] rounded-xl p-3 text-center">
            <p className="text-2xl font-display text-gold-400">{score}%</p>
            <p className="text-[11px] text-neutral-500 mt-1">Compatibilidade</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3 text-center">
            <p className="text-2xl font-display text-electric-400">{noteSimilarity}%</p>
            <p className="text-[11px] text-neutral-500 mt-1">Similaridade de notas</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3 text-center">
            <p className="text-lg font-display">{priceLabel}</p>
            <p className="text-[11px] text-neutral-500 mt-1">{overBudget ? "Acima do orçamento" : "Preço aprox."}</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3 text-center">
            <p className="text-lg font-display capitalize">{perfume.intensity}</p>
            <p className="text-[11px] text-neutral-500 mt-1">Intensidade</p>
          </div>
        </div>

        {breakdown.length > 0 && (
          <div className="mb-6">
            <p className="section-label mb-3">Como chegamos nos {score}%</p>
            <div className="space-y-2.5">
              {breakdown.map((b, i) => {
                const pct = b.max > 0 ? Math.min(100, Math.round((b.earned / b.max) * 100)) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs text-neutral-400 mb-1">
                      <span>{b.label}</span>
                      <span>
                        {Math.round(b.earned)}/{b.max} pts
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gold-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {penalty > 0 && (
                <p className="text-xs text-red-400 pt-1">
                  −{penalty} pontos por conter nota(s) que você prefere evitar
                </p>
              )}
            </div>
          </div>
        )}

        {reasons.length > 0 && (
          <div className="mb-6">
            <p className="section-label mb-2">Por que recomendamos isso?</p>
            <ul className="space-y-1.5">
              {reasons.map((r, i) => (
                <li key={i} className="text-sm text-neutral-300 flex gap-2">
                  <span className="text-gold-400">•</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-neutral-300 text-sm mb-6">{perfume.description}</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-6 text-sm">
          <div>
            <p className="text-neutral-500 mb-1">Notas de saída</p>
            <p className="text-neutral-200">{noteLabels(perfume.notesTop)}</p>
          </div>
          <div>
            <p className="text-neutral-500 mb-1">Notas de coração</p>
            <p className="text-neutral-200">{noteLabels(perfume.notesHeart)}</p>
          </div>
          <div>
            <p className="text-neutral-500 mb-1">Notas de fundo</p>
            <p className="text-neutral-200">{noteLabels(perfume.notesBase)}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-neutral-500 mb-1">Família olfativa</p>
            <p className="text-neutral-200">{perfume.family.map((f) => FAMILY_LABELS[f]).join(", ")}</p>
          </div>
          <div>
            <p className="text-neutral-500 mb-1">Performance</p>
            <p className="text-neutral-200">
              Duração {perfume.longevity} · Projeção {perfume.sillage}
            </p>
          </div>
          <div>
            <p className="text-neutral-500 mb-1">Ocasiões recomendadas</p>
            <p className="text-neutral-200">
              {perfume.occasions.map((o) => OCCASIONS.find((x) => x.id === o)?.label).join(", ")}
            </p>
          </div>
          <div>
            <p className="text-neutral-500 mb-1">Estações recomendadas</p>
            <p className="text-neutral-200">
              {perfume.seasons.map((s) => SEASONS.find((x) => x.id === s)?.label).join(", ")}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="section-label mb-2 text-emerald-400">Pontos positivos</p>
            <ul className="space-y-1">
              {perfume.pros.map((p, i) => (
                <li key={i} className="text-sm text-neutral-300">
                  + {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label mb-2 text-red-400">Possíveis pontos negativos</p>
            <ul className="space-y-1">
              {perfume.cons.map((c, i) => (
                <li key={i} className="text-sm text-neutral-300">
                  − {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
