import { Gender } from "@/types/perfume";

interface FilterBarProps {
  sortBy: "compat" | "price";
  onSortChange: (v: "compat" | "price") => void;
  genderFilter: Gender | "todos";
  onGenderChange: (v: Gender | "todos") => void;
  resultCount: number;
}

export default function FilterBar({
  sortBy,
  onSortChange,
  genderFilter,
  onGenderChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <p className="text-neutral-400 text-sm">
        {resultCount} perfume{resultCount !== 1 ? "s" : ""} encontrado{resultCount !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5">
          {(["todos", "masculino", "feminino", "unissex"] as const).map((g) => (
            <button
              key={g}
              onClick={() => onGenderChange(g)}
              className={`chip ${genderFilter === g ? "chip-selected" : ""}`}
            >
              {g === "todos" ? "Todos" : g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as "compat" | "price")}
          className="bg-white/[0.04] border border-white/10 rounded-full px-4 py-1.5 text-sm text-neutral-200 outline-none"
        >
          <option value="compat">Ordenar por compatibilidade</option>
          <option value="price">Ordenar por preço</option>
        </select>
      </div>
    </div>
  );
}
