import { PERFUMES } from "@/data/perfumes";
import { NOTES } from "@/data/notes";
import { Style, Occasion } from "@/types/perfume";

export interface ParsedFreeText {
  impliedNotes: string[];
  impliedStyles: Style[];
  impliedOccasions: Occasion[];
  referencePerfumeIds: string[];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const STYLE_SYNONYMS: Record<Style, string[]> = {
  fresco: ["fresco", "refrescante"],
  doce: ["doce", "adocicado", "acucarado"],
  amadeirado: ["amadeirado", "madeira", "madeirado"],
  citrico: ["citrico"],
  aromatico: ["aromatico", "ervas"],
  especiado: ["especiado", "picante", "apimentado"],
  elegante: ["elegante", "sofisticado", "classico"],
  casual: ["casual", "dia a dia", "despojado"],
  sedutor: ["sedutor", "sensual", "provocante"],
  limpo: ["limpo", "clean", "higienico"],
};

const OCCASION_SYNONYMS: Record<Occasion, string[]> = {
  escola: ["escola", "faculdade", "aula"],
  "dia-a-dia": ["dia a dia", "cotidiano", "rotina"],
  trabalho: ["trabalho", "escritorio", "reuniao"],
  encontro: ["encontro", "date", "romantico"],
  festa: ["festa", "balada"],
  academia: ["academia", "treino", "gym"],
  verao: ["verao", "praia", "calor"],
  inverno: ["inverno", "frio"],
  formal: ["formal", "cerimonia", "casamento"],
  casual: ["casual", "descontraido"],
  noite: ["noite", "a noite"],
  "assinatura-pessoal": ["assinatura", "minha cara", "perfume marcante"],
};

// Interpretador local baseado em palavras-chave. Não depende de nenhuma
// API externa, então o site funciona 100% mesmo sem OPENAI_API_KEY
// configurada (ver lib/ai.ts para a versão opcional com IA).
export function parseFreeTextLocally(text: string): ParsedFreeText {
  const normalized = normalize(text);

  const impliedNotes = NOTES.filter((note) => {
    const normLabel = normalize(note.label);
    const normId = normalize(note.id.replace(/-/g, " "));
    return normalized.includes(normLabel) || normalized.includes(normId);
  }).map((n) => n.id);

  const impliedStyles = (Object.keys(STYLE_SYNONYMS) as Style[]).filter((style) =>
    STYLE_SYNONYMS[style].some((syn) => normalized.includes(syn))
  );

  const impliedOccasions = (Object.keys(OCCASION_SYNONYMS) as Occasion[]).filter((occ) =>
    OCCASION_SYNONYMS[occ].some((syn) => normalized.includes(syn))
  );

  // Detecta se o usuário citou o nome de um perfume do catálogo
  // (ex.: "parecido com Club de Nuit Blue Icon") para usar como referência
  // de comparação no motor de recomendação.
  const referencePerfumeIds = PERFUMES.filter((p) => {
    const nameWords = normalize(p.name)
      .split(" ")
      .filter((w) => w.length > 2 && w !== "de");
    if (nameWords.length === 0) return false;
    const matchedWords = nameWords.filter((w) => normalized.includes(w));
    return matchedWords.length / nameWords.length >= 0.6;
  }).map((p) => p.id);

  return { impliedNotes, impliedStyles, impliedOccasions, referencePerfumeIds };
}
