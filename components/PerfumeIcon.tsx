import { OlfactoryFamily } from "@/types/perfume";

const FAMILY_COLORS: Record<OlfactoryFamily, [string, string]> = {
  citrus: ["#f2c94c", "#e8963a"],
  floral: ["#f7b8d0", "#d888ab"],
  woody: ["#a97c50", "#6e4a2e"],
  oriental: ["#d4af37", "#7a4a1f"],
  fougere: ["#8fbf8f", "#4f7a4f"],
  aromatic: ["#7fb3d5", "#3f6f8f"],
  leather: ["#8a5a3c", "#4a2e1c"],
  gourmand: ["#e8b89b", "#b5723f"],
  fresh: ["#7fd6d6", "#3f9e9e"],
  spicy: ["#d97b4f", "#8f3f1f"],
};

export default function PerfumeIcon({ family }: { family: OlfactoryFamily[] }) {
  const main = family[0] ?? "woody";
  const [c1, c2] = FAMILY_COLORS[main] ?? FAMILY_COLORS.woody;
  const gradId = `grad-${main}`;

  return (
    <svg viewBox="0 0 120 160" className="w-full h-full">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c2} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect x="45" y="10" width="30" height="18" rx="4" fill="#1a1a1d" stroke="#333" />
      <rect x="52" y="2" width="16" height="12" rx="2" fill="#0a0a0b" />
      <rect x="25" y="28" width="70" height="120" rx="14" fill={`url(#${gradId})`} opacity="0.85" />
      <rect x="25" y="28" width="70" height="120" rx="14" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <rect x="33" y="60" width="54" height="30" rx="3" fill="rgba(10,10,11,0.35)" />
    </svg>
  );
}
