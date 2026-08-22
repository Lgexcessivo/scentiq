"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "scentiq-favorites";

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Guarda a lista de perfumes favoritados no navegador da pessoa (localStorage).
// Não precisa de login nem de banco de dados — os favoritos ficam só
// naquele navegador/computador específico.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Lê do localStorage só depois que o componente montou no navegador,
  // pra evitar erro de "hydration mismatch" do Next.js.
  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage pode falhar em modo anônimo/privado — ignora
        // silenciosamente, o favorito só não persiste entre sessões.
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggle, isFavorite };
}
