"use client";

import { useState, FormEvent } from "react";
import { NOTES, OCCASIONS, SEASONS, INTENSITIES, STYLES } from "@/data/notes";
import { UserPreferences } from "@/types/preferences";
import { Occasion, Season, Style, Intensity } from "@/types/perfume";
import NoteSelector from "./NoteSelector";

interface PreferenceFormProps {
  initialValues: UserPreferences;
  onSubmit: (prefs: UserPreferences) => void;
}

export default function PreferenceForm({ initialValues, onSubmit }: PreferenceFormProps) {
  const [likedNotes, setLikedNotes] = useState<string[]>(initialValues.likedNotes);
  const [dislikedNotes, setDislikedNotes] = useState<string[]>(initialValues.dislikedNotes);
  const [maxPrice, setMaxPrice] = useState<string>(
    initialValues.maxPrice ? String(initialValues.maxPrice) : ""
  );
  const [currency, setCurrency] = useState<"BRL" | "USD">(initialValues.currency);
  const [occasions, setOccasions] = useState<Occasion[]>(initialValues.occasions);
  const [season, setSeason] = useState<Season | undefined>(initialValues.season);
  const [intensity, setIntensity] = useState<Intensity>(initialValues.intensity);
  const [styles, setStyles] = useState<Style[]>(initialValues.styles);
  const [freeText, setFreeText] = useState<string>(initialValues.freeText ?? "");
  const [error, setError] = useState<string | null>(null);

  function toggleLiked(id: string) {
    setDislikedNotes((prev) => prev.filter((n) => n !== id));
    setLikedNotes((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]));
  }

  function toggleDisliked(id: string) {
    setLikedNotes((prev) => prev.filter((n) => n !== id));
    setDislikedNotes((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]));
  }

  function toggleOccasion(id: Occasion) {
    setOccasions((prev) => (prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]));
  }

  function toggleStyle(id: Style) {
    setStyles((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (likedNotes.length === 0) {
      setError("Escolha pelo menos uma nota que você gosta.");
      return;
    }

    const price = Number(maxPrice.replace(",", "."));
    if (!maxPrice || !Number.isFinite(price) || price <= 0) {
      setError("Informe um preço máximo válido (maior que zero).");
      return;
    }

    if (occasions.length === 0) {
      setError("Escolha pelo menos uma ocasião.");
      return;
    }

    onSubmit({
      likedNotes,
      dislikedNotes,
      maxPrice: price,
      currency,
      occasions,
      season,
      intensity,
      styles,
      freeText: freeText.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-6 pb-24 animate-rise">
      <div className="glass-card p-6 sm:p-8 space-y-10">
        <div>
          <p className="section-label mb-3">Notas que você gosta</p>
          <NoteSelector
            notes={NOTES}
            selected={likedNotes}
            otherSelected={dislikedNotes}
            onToggle={toggleLiked}
            variant="like"
          />
        </div>

        <div>
          <p className="section-label mb-3">Notas que você não gosta (opcional)</p>
          <NoteSelector
            notes={NOTES}
            selected={dislikedNotes}
            otherSelected={likedNotes}
            onToggle={toggleDisliked}
            variant="dislike"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="section-label mb-3">Preço máximo</p>
            <input
              type="text"
              inputMode="decimal"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder={currency === "BRL" ? "Ex: 300" : "Ex: 60"}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-neutral-100 outline-none focus:border-gold-500/60"
            />
          </div>
          <div>
            <p className="section-label mb-3">Moeda</p>
            <div className="flex gap-2">
              {(["BRL", "USD"] as const).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`chip ${currency === c ? "chip-selected" : ""}`}
                >
                  {c === "BRL" ? "R$ (Real)" : "US$ (Dólar)"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="section-label mb-3">Ocasião</p>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                type="button"
                key={o.id}
                onClick={() => toggleOccasion(o.id)}
                className={`chip ${occasions.includes(o.id) ? "chip-selected" : ""}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="section-label mb-3">Estação do ano (opcional)</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSeason(undefined)}
              className={`chip ${!season ? "chip-selected" : ""}`}
            >
              Sem preferência
            </button>
            {SEASONS.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setSeason(s.id)}
                className={`chip ${season === s.id ? "chip-selected" : ""}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="section-label mb-3">Intensidade desejada</p>
          <div className="flex flex-wrap gap-2">
            {INTENSITIES.map((i) => (
              <button
                type="button"
                key={i.id}
                onClick={() => setIntensity(i.id)}
                className={`chip ${intensity === i.id ? "chip-selected" : ""}`}
                title={i.description}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="section-label mb-3">Preferência de estilo</p>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => toggleStyle(s.id)}
                className={`chip ${styles.includes(s.id) ? "chip-selected" : ""}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="section-label mb-3">Conte mais (opcional)</p>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Ex: Quero um perfume parecido com Club de Nuit Blue Icon, mas mais fresco e que funcione bem na escola."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-neutral-100 outline-none focus:border-gold-500/60 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full">
          Encontrar perfumes
        </button>
      </div>
    </form>
  );
}
