"use client";

import { useState } from "react";
import Hero from "./Hero";
import PreferenceForm from "./PreferenceForm";
import LoadingState from "./LoadingState";
import ResultsList from "./ResultsList";
import ErrorState from "./ErrorState";
import { UserPreferences } from "@/types/preferences";
import type { RecommendationResult } from "@/lib/recommendation";

type View = "form" | "loading" | "results" | "error";

const DEFAULT_PREFERENCES: UserPreferences = {
  likedNotes: [],
  dislikedNotes: [],
  maxPrice: 0,
  currency: "BRL",
  occasions: [],
  season: undefined,
  intensity: "moderada",
  styles: [],
  freeText: "",
};

export default function PerfumeFinder() {
  const [view, setView] = useState<View>("form");
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [relaxed, setRelaxed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(prefs: UserPreferences) {
    setPreferences(prefs);
    setView("loading");

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Não foi possível calcular as recomendações.");
        setView("error");
        return;
      }

      setResults(data.results);
      setRelaxed(data.relaxed);
      setView("results");
    } catch {
      setErrorMessage("Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.");
      setView("error");
    }
  }

  return (
    <>
      <Hero />
      {view === "form" && <PreferenceForm initialValues={preferences} onSubmit={handleSubmit} />}
      {view === "loading" && <LoadingState />}
      {view === "results" && (
        <ResultsList
          results={results}
          relaxed={relaxed}
          currency={preferences.currency}
          preferences={preferences}
          onReset={() => {
            setPreferences(DEFAULT_PREFERENCES);
            setView("form");
          }}
          onEditPreferences={() => setView("form")}
        />
      )}
      {view === "error" && <ErrorState message={errorMessage} onRetry={() => setView("form")} />}
    </>
  );
}
