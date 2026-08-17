import { Perfume, Style } from "@/types/perfume";
import { UserPreferences } from "@/types/preferences";
import { PERFUMES } from "@/data/perfumes";
import { NOTE_MAP, STYLES } from "@/data/notes";
import { ParsedFreeText } from "./textParser";

export interface RecommendationResult {
  perfume: Perfume;
  score: number;
  noteSimilarity: number;
  reasons: string[];
  overBudget: boolean;
}

const STYLE_LABEL: Record<Style, string> = Object.fromEntries(
  STYLES.map((s) => [s.id, s.label])
) as Record<Style, string>;

/*
 * COMO FUNCIONA O CÁLCULO DE COMPATIBILIDADE (0-100%)
 * -----------------------------------------------------
 * A pontuação é dividida em critérios com pesos fixos. Cada critério só
 * entra na conta se o usuário de fato informou aquela preferência (ex.:
 * "estação" é opcional, então só conta se o usuário escolheu uma).
 * No final, fazemos: (pontos conquistados / pontos possíveis) * 100.
 *
 * Pesos quando TODOS os critérios são informados:
 *   - Notas que gosta ......... 30 pontos
 *   - Ocasião .................. 15 pontos
 *   - Estação (opcional) ........ 8 pontos
 *   - Intensidade .............. 10 pontos
 *   - Estilo .................... 15 pontos
 *   - Preço ..................... 12 pontos
 *   - Texto livre (bônus) ...... até 10 pontos
 *   Total possível: 100 pontos
 *
 * Notas que o usuário NÃO gosta não somam pontos: elas geram uma
 * PENALIZAÇÃO (subtraída do total), para empurrar esses perfumes para
 * baixo na lista sem necessariamente escondê-los.
 */

const WEIGHTS = {
  likedNotes: 30,
  occasion: 15,
  season: 8,
  intensity: 10,
  style: 15,
  price: 12,
  freeText: 10,
};

function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function allNotesOf(perfume: Perfume): string[] {
  return Array.from(new Set([...perfume.notesTop, ...perfume.notesHeart, ...perfume.notesBase]));
}

export function scorePerfume(
  perfume: Perfume,
  prefs: UserPreferences,
  textHints: ParsedFreeText | null
): { score: number; noteSimilarity: number; reasons: string[]; overBudget: boolean } {
  const likedNotes = Array.from(new Set([...prefs.likedNotes, ...(textHints?.impliedNotes ?? [])]));
  const styles = Array.from(new Set([...prefs.styles, ...(textHints?.impliedStyles ?? [])]));
  const occasions = Array.from(new Set([...prefs.occasions, ...(textHints?.impliedOccasions ?? [])]));
  const perfumeNotes = allNotesOf(perfume);

  const reasons: string[] = [];
  let earned = 0;
  let available = 0;

  // 1) Notas que o usuário gosta (peso 30)
  if (likedNotes.length > 0) {
    available += WEIGHTS.likedNotes;
    const matchedExact = likedNotes.filter((n) => perfumeNotes.includes(n));
    const matchedByFamily = likedNotes.filter(
      (n) => !matchedExact.includes(n) && NOTE_MAP[n] && perfume.family.includes(NOTE_MAP[n].family)
    );
    const ratio = matchedExact.length / likedNotes.length + (matchedByFamily.length / likedNotes.length) * 0.4;
    earned += WEIGHTS.likedNotes * Math.min(1, ratio);
    if (matchedExact.length > 0) {
      const labels = matchedExact.map((n) => NOTE_MAP[n]?.label ?? n).join(", ");
      reasons.push(`Tem ${matchedExact.length} das suas notas favoritas: ${labels}`);
    }
  }

  // 2) Notas que o usuário NÃO gosta — penalidade
  let penalty = 0;
  if (prefs.dislikedNotes.length > 0) {
    const matchedDisliked = prefs.dislikedNotes.filter((n) => perfumeNotes.includes(n));
    penalty = matchedDisliked.length * 18;
  }

  // 3) Ocasião (peso 15)
  if (occasions.length > 0) {
    available += WEIGHTS.occasion;
    if (perfume.occasions.some((o) => occasions.includes(o))) {
      earned += WEIGHTS.occasion;
      reasons.push("Combina com a ocasião que você escolheu");
    }
  }

  // 4) Estação (peso 8, opcional)
  if (prefs.season) {
    available += WEIGHTS.season;
    if (perfume.seasons.includes(prefs.season)) {
      earned += WEIGHTS.season;
      reasons.push("Recomendado para a estação que você escolheu");
    }
  }

  // 5) Intensidade (peso 10, com crédito parcial se for próxima)
  available += WEIGHTS.intensity;
  if (perfume.intensity === prefs.intensity) {
    earned += WEIGHTS.intensity;
    reasons.push(`Intensidade ${prefs.intensity}, como você pediu`);
  } else {
    const order = ["leve", "moderada", "forte"];
    const diff = Math.abs(order.indexOf(perfume.intensity) - order.indexOf(prefs.intensity));
    if (diff === 1) earned += WEIGHTS.intensity * 0.4;
  }

  // 6) Estilo (peso 15)
  if (styles.length > 0) {
    available += WEIGHTS.style;
    const matched = perfume.styles.filter((s) => styles.includes(s));
    earned += WEIGHTS.style * Math.min(1, matched.length / styles.length);
    if (matched.length > 0) {
      reasons.push(`Estilo ${matched.map((s) => STYLE_LABEL[s]).join(", ")}`);
    }
  }

  // 7) Preço (peso 12) — perde pontos proporcionalmente quanto mais
  // ultrapassa o orçamento informado
  available += WEIGHTS.price;
  const price = prefs.currency === "BRL" ? perfume.priceBRL : perfume.priceUSD;
  const overBudget = price > prefs.maxPrice;
  if (!overBudget) {
    earned += WEIGHTS.price;
    reasons.push("Dentro do seu orçamento");
  } else {
    const excessRatio = (price - prefs.maxPrice) / prefs.maxPrice;
    earned += Math.max(0, WEIGHTS.price * (1 - excessRatio * 2));
  }

  // 8) Bônus de texto livre (até 10 pontos) — usa notas/estilos implícitos
  // e similaridade com um perfume citado como referência
  if (textHints) {
    available += WEIGHTS.freeText;
    const noteBonus = textHints.impliedNotes.filter((n) => perfumeNotes.includes(n)).length * 2;
    const styleBonus = textHints.impliedStyles.filter((s) => perfume.styles.includes(s)).length * 1.5;
    let refBonus = 0;
    if (textHints.referencePerfumeIds.length > 0) {
      const sims = textHints.referencePerfumeIds
        .filter((id) => id !== perfume.id)
        .map((id) => {
          const ref = PERFUMES.find((p) => p.id === id);
          return ref ? jaccardSimilarity(perfumeNotes, allNotesOf(ref)) : 0;
        });
      refBonus = sims.length > 0 ? Math.max(...sims) * 10 : 0;
      if (refBonus > 5) reasons.push("Perfil parecido com o perfume que você mencionou");
    }
    earned += Math.min(WEIGHTS.freeText, noteBonus + styleBonus + refBonus);
  }

  const rawScore = available > 0 ? (earned / available) * 100 : 0;
  const finalScore = Math.max(0, Math.min(100, rawScore - penalty));

  const noteSimilarity =
    likedNotes.length > 0
      ? Math.round((likedNotes.filter((n) => perfumeNotes.includes(n)).length / likedNotes.length) * 100)
      : 0;

  return {
    score: Math.round(finalScore),
    noteSimilarity,
    reasons: reasons.slice(0, 4),
    overBudget,
  };
}

export function getRecommendations(
  prefs: UserPreferences,
  textHints: ParsedFreeText | null
): { results: RecommendationResult[]; relaxed: boolean } {
  const scored: RecommendationResult[] = PERFUMES.map((perfume) => {
    const { score, noteSimilarity, reasons, overBudget } = scorePerfume(perfume, prefs, textHints);
    return { perfume, score, noteSimilarity, reasons, overBudget };
  });

  // Filtro "rígido": tira da lista principal perfumes muito acima do
  // orçamento (mais de 40%) ou com notas indesejadas fortes demais.
  const strict = scored.filter((r) => {
    const price = prefs.currency === "BRL" ? r.perfume.priceBRL : r.perfume.priceUSD;
    const withinBudgetMargin = price <= prefs.maxPrice * 1.4;
    const tooManyDisliked =
      prefs.dislikedNotes.length >= 2 &&
      prefs.dislikedNotes.filter((n) => allNotesOf(r.perfume).includes(n)).length >= 2;
    return withinBudgetMargin && !tooManyDisliked;
  });

  // Se o filtro rígido zerar os resultados (nenhum perfume compatível),
  // relaxamos as regras e mostramos as melhores alternativas mesmo assim,
  // sinalizando isso para a interface através de "relaxed: true".
  const pool = strict.length > 0 ? strict : scored;
  const relaxed = strict.length === 0;

  const sorted = [...pool].sort((a, b) => b.score - a.score);
  return { results: sorted.slice(0, 12), relaxed };
}
