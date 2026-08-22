import type { Perfume } from "@/types/perfume";
import { FAMILY_LABELS } from "@/data/notes";
import PerfumeIcon from "./PerfumeIcon";
import HeartButton from "./HeartButton";

interface CatalogCardProps {
  perfume: Perfume;
  currency: "BRL" | "USD";
  onOpenDetails: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function CatalogCard({
  perfume,
  currency,
  onOpenDetails,
  isFavorite,
  onToggleFavorite,
}: CatalogCardProps) {
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
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wide">{perfume.brand}</p>
          <h3 className="font-display text-lg leading-snug">{perfume.name}</h3>
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
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10 capitalize">
            {perfume.gender}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          <p className="text-neutral-100 font-semibold">{priceLabel}</p>
          <button onClick={onOpenDetails} className="text-sm text-gold-400 hover:text-gold-300 font-medium">
            Ver detalhes →
          </button>
        </div>
      </div>
    </div>
  );
}
