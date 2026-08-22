// Tipos centrais do domínio "perfume".
// Qualquer novo campo de um perfume deve ser adicionado aqui primeiro,
// para que o TypeScript avise onde mais precisa ser atualizado.

export type OlfactoryFamily =
  | "citrus"
  | "floral"
  | "woody"
  | "oriental"
  | "fougere"
  | "aromatic"
  | "leather"
  | "gourmand"
  | "fresh"
  | "spicy";

export type Gender = "masculino" | "feminino" | "unissex";

export type Occasion =
  | "escola"
  | "dia-a-dia"
  | "trabalho"
  | "encontro"
  | "festa"
  | "academia"
  | "verao"
  | "inverno"
  | "formal"
  | "casual"
  | "noite"
  | "assinatura-pessoal";

export type Season = "verao" | "outono" | "inverno" | "primavera";

export type Intensity = "leve" | "moderada" | "forte";

export type Sillage = "discreta" | "moderada" | "forte";

export type Style =
  | "fresco"
  | "doce"
  | "floral"
  | "amadeirado"
  | "citrico"
  | "aromatico"
  | "especiado"
  | "elegante"
  | "casual"
  | "sedutor"
  | "limpo";

export type PriceTier = "acessivel" | "intermediario" | "premium";

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  image?: string;
  gender: Gender;
  priceTier: PriceTier;
  priceBRL: number;
  priceUSD: number;
  notesTop: string[];
  notesHeart: string[];
  notesBase: string[];
  family: OlfactoryFamily[];
  occasions: Occasion[];
  seasons: Season[];
  intensity: Intensity;
  longevity: string;
  sillage: Sillage;
  styles: Style[];
  description: string;
  pros: string[];
  cons: string[];
}
