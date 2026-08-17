import { Intensity, Occasion, Season, Style } from "./perfume";

export interface UserPreferences {
  likedNotes: string[];
  dislikedNotes: string[];
  maxPrice: number;
  currency: "BRL" | "USD";
  occasions: Occasion[];
  season?: Season;
  intensity: Intensity;
  styles: Style[];
  freeText?: string;
}
