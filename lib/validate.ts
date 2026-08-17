import { UserPreferences } from "@/types/preferences";
import { Occasion, Season, Style, Intensity } from "@/types/perfume";
import { NOTE_MAP, OCCASIONS, SEASONS, STYLES } from "@/data/notes";

const VALID_OCCASIONS = new Set(OCCASIONS.map((o) => o.id));
const VALID_SEASONS = new Set(SEASONS.map((s) => s.id));
const VALID_STYLES = new Set(STYLES.map((s) => s.id));
const VALID_INTENSITIES = new Set(["leve", "moderada", "forte"]);

type ValidationResult =
  | { valid: true; preferences: UserPreferences }
  | { valid: false; error: string };

// Esta função garante que o back-end nunca quebra com dados vazios,
// inválidos ou mal formados vindos do formulário — mesmo que alguém
// tente chamar a API diretamente (fora do site).
export function validatePreferences(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Dados inválidos." };
  }

  const b = body as Record<string, unknown>;

  const likedNotes = Array.isArray(b.likedNotes)
    ? b.likedNotes.filter((n): n is string => typeof n === "string" && !!NOTE_MAP[n])
    : [];

  if (likedNotes.length === 0) {
    return { valid: false, error: "Selecione pelo menos uma nota que você gosta." };
  }

  const dislikedNotes = Array.isArray(b.dislikedNotes)
    ? b.dislikedNotes.filter((n): n is string => typeof n === "string" && !!NOTE_MAP[n])
    : [];

  const maxPrice = Number(b.maxPrice);
  if (!Number.isFinite(maxPrice) || maxPrice <= 0) {
    return { valid: false, error: "Informe um preço máximo válido, maior que zero." };
  }

  const currency = b.currency === "USD" ? "USD" : "BRL";

  const occasions = Array.isArray(b.occasions)
    ? b.occasions.filter((o): o is Occasion => typeof o === "string" && VALID_OCCASIONS.has(o as Occasion))
    : [];
  if (occasions.length === 0) {
    return { valid: false, error: "Selecione pelo menos uma ocasião." };
  }

  const season =
    typeof b.season === "string" && VALID_SEASONS.has(b.season as Season)
      ? (b.season as Season)
      : undefined;

  const intensity =
    typeof b.intensity === "string" && VALID_INTENSITIES.has(b.intensity)
      ? (b.intensity as Intensity)
      : "moderada";

  const styles = Array.isArray(b.styles)
    ? b.styles.filter((s): s is Style => typeof s === "string" && VALID_STYLES.has(s as Style))
    : [];

  const freeText = typeof b.freeText === "string" ? b.freeText.slice(0, 500) : "";

  return {
    valid: true,
    preferences: {
      likedNotes,
      dislikedNotes,
      maxPrice,
      currency,
      occasions,
      season,
      intensity,
      styles,
      freeText,
    },
  };
}
