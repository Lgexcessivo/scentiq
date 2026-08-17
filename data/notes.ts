import { Intensity, OlfactoryFamily, Occasion, Season, Style } from "@/types/perfume";

export interface NoteDef {
  id: string;
  label: string;
  family: OlfactoryFamily;
}

// Lista de notas olfativas conhecidas pelo sistema. O usuário só consegue
// escolher notas desta lista (via chips na interface), o que evita que ele
// digite algo que "não existe na base" — é assim que o requisito de
// tratamento de erro para preferências inválidas é resolvido no formulário.
export const NOTES: NoteDef[] = [
  { id: "bergamot", label: "Bergamota", family: "citrus" },
  { id: "lemon", label: "Limão", family: "citrus" },
  { id: "orange", label: "Laranja", family: "citrus" },
  { id: "grapefruit", label: "Toranja", family: "citrus" },
  { id: "mandarin", label: "Tangerina", family: "citrus" },
  { id: "lavender", label: "Lavanda", family: "fougere" },
  { id: "tonka-bean", label: "Fava tonka", family: "fougere" },
  { id: "rose", label: "Rosa", family: "floral" },
  { id: "jasmine", label: "Jasmim", family: "floral" },
  { id: "ylang-ylang", label: "Ylang-ylang", family: "floral" },
  { id: "iris", label: "Íris", family: "floral" },
  { id: "violet", label: "Violeta", family: "floral" },
  { id: "geranium", label: "Gerânio", family: "floral" },
  { id: "white-flowers", label: "Flores brancas", family: "floral" },
  { id: "vanilla", label: "Baunilha", family: "gourmand" },
  { id: "amber", label: "Âmbar", family: "oriental" },
  { id: "musk", label: "Almíscar", family: "oriental" },
  { id: "oud", label: "Oud", family: "oriental" },
  { id: "saffron", label: "Açafrão", family: "spicy" },
  { id: "sandalwood", label: "Sândalo", family: "woody" },
  { id: "cedarwood", label: "Cedro", family: "woody" },
  { id: "patchouli", label: "Patchouli", family: "woody" },
  { id: "vetiver", label: "Vetiver", family: "woody" },
  { id: "leather", label: "Couro", family: "leather" },
  { id: "tobacco", label: "Tabaco", family: "leather" },
  { id: "cinnamon", label: "Canela", family: "spicy" },
  { id: "cardamom", label: "Cardamomo", family: "spicy" },
  { id: "pepper", label: "Pimenta", family: "spicy" },
  { id: "coffee", label: "Café", family: "gourmand" },
  { id: "cacao", label: "Cacau", family: "gourmand" },
  { id: "caramel", label: "Caramelo", family: "gourmand" },
  { id: "coconut", label: "Coco", family: "gourmand" },
  { id: "honey", label: "Mel", family: "gourmand" },
  { id: "almond", label: "Amêndoa", family: "gourmand" },
  { id: "pineapple", label: "Abacaxi", family: "fresh" },
  { id: "apple", label: "Maçã", family: "fresh" },
  { id: "pear", label: "Pera", family: "fresh" },
  { id: "peach", label: "Pêssego", family: "fresh" },
  { id: "fig", label: "Figo", family: "fresh" },
  { id: "mint", label: "Menta", family: "fresh" },
  { id: "basil", label: "Manjericão", family: "fresh" },
  { id: "sea-notes", label: "Notas marinhas", family: "fresh" },
];

export const NOTE_MAP: Record<string, NoteDef> = Object.fromEntries(
  NOTES.map((n) => [n.id, n])
);

export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "escola", label: "Escola" },
  { id: "dia-a-dia", label: "Dia a dia" },
  { id: "trabalho", label: "Trabalho" },
  { id: "encontro", label: "Encontro" },
  { id: "festa", label: "Festa" },
  { id: "academia", label: "Academia" },
  { id: "verao", label: "Verão" },
  { id: "inverno", label: "Inverno" },
  { id: "formal", label: "Formal" },
  { id: "casual", label: "Casual" },
  { id: "noite", label: "Noite" },
  { id: "assinatura-pessoal", label: "Assinatura pessoal" },
];

export const SEASONS: { id: Season; label: string }[] = [
  { id: "verao", label: "Verão" },
  { id: "outono", label: "Outono" },
  { id: "inverno", label: "Inverno" },
  { id: "primavera", label: "Primavera" },
];

export const INTENSITIES: { id: Intensity; label: string; description: string }[] = [
  { id: "leve", label: "Leve", description: "Discreto, fica perto do corpo" },
  { id: "moderada", label: "Moderada", description: "Perceptível sem exagerar" },
  { id: "forte", label: "Forte", description: "Presença marcante e duradoura" },
];

export const STYLES: { id: Style; label: string }[] = [
  { id: "fresco", label: "Fresco" },
  { id: "doce", label: "Doce" },
  { id: "amadeirado", label: "Amadeirado" },
  { id: "citrico", label: "Cítrico" },
  { id: "aromatico", label: "Aromático" },
  { id: "especiado", label: "Especiado" },
  { id: "elegante", label: "Elegante" },
  { id: "casual", label: "Casual" },
  { id: "sedutor", label: "Sedutor" },
  { id: "limpo", label: "Limpo" },
];

export const FAMILY_LABELS: Record<OlfactoryFamily, string> = {
  citrus: "Cítrica",
  floral: "Floral",
  woody: "Amadeirada",
  oriental: "Oriental",
  fougere: "Fougère",
  aromatic: "Aromática",
  leather: "Couro",
  gourmand: "Gourmand",
  fresh: "Fresca",
  spicy: "Especiada",
};
