import type { RecommendationResult } from "@/lib/recommendation";
import { FAMILY_LABELS } from "@/data/notes";
import PerfumeIcon from "./PerfumeIcon";
import HeartButton from "./HeartButton";

interface PerfumeCardProps {
  result: RecommendationResult;
  currency: "BRL" | "USD";
  onOpenDetails: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function PerfumeCard({
  result,
  currency,
  onOpenDetails,
  isFavorite,
  onToggleFavorite,
}: PerfumeCardProps) {
  const { perfume, score, overBudget } = result;
  const price = currency === "BRL" ? perfume.priceBRL : perfume.priceUSD;
  const priceLabel = currency === "BRL" ? `R$ ${price}` : `US$ ${price}`;

  return (
    <div className="glass-card overflow-hidden flex flex-col animate-rise">
      <div className="h-40 bg-black/20 flex items-center justify-center p-4 relative">
        <HeartButton active={isFavorite} onToggle={onToggleFavorite} />
        {perfume.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={perfume.image}
            alt={`${perfume.brand} ${perfume.name}`}
            className="h-full w-auto object-contain"
          />
        ) : (
          <div className="w-20 h-28">
            <PerfumeIcon family={perfume.family} />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">{perfume.brand}</p>
            <h3 className="font-display text-lg leading-snug">{perfume.name}</h3>
          </div>
          <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/30">
            {score}%
          </span>
        </div>

        <p className="text-sm text-neutral-400 line-clamp-2">{perfume.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {perfume.family.map((f) => (
            <span
              key={f}
              className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10"
            >
              {FAMILY_LABELS[f]}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <p className="text-neutral-100 font-semibold">{priceLabel}</p>
            {overBudget && <p className="text-[11px] text-amber-400">Acima do seu orçamento</p>}
          </div>
          <button onClick={onOpenDetails} className="text-sm text-gold-400 hover:text-gold-300 font-medium">
            Ver detalhes →
          </button>
        </div>
      </div>
    </div>
  );
}
