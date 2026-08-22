import { NextResponse } from "next/server";
import { validatePreferences } from "@/lib/validate";
import { parseFreeTextLocally, ParsedFreeText } from "@/lib/textParser";
import { parseFreeTextWithAI } from "@/lib/ai";
import { getRecommendations } from "@/lib/recommendation";

// Esta rota roda no servidor (nunca no navegador), por isso é o único
// lugar do projeto que pode ler process.env.GEMINI_API_KEY com segurança.
export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Não foi possível ler os dados enviados." },
        { status: 400 }
      );
    }

    const validation = validatePreferences(body);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const preferences = validation.preferences;

    let textHints: ParsedFreeText | null = null;
    if (preferences.freeText && preferences.freeText.trim().length > 0) {
      // O interpretador local sempre roda (rápido, grátis e confiável).
      const local = parseFreeTextLocally(preferences.freeText);

      // Se houver uma chave do Gemini configurada, tentamos enriquecer o
      // resultado com a IA. Se falhar por qualquer motivo, ficamos só com
      // o resultado local — o site nunca quebra por causa disso.
      let ai: ParsedFreeText | null = null;
      if (process.env.GEMINI_API_KEY) {
        ai = await parseFreeTextWithAI(preferences.freeText).catch(() => null);
      }

      textHints = ai
        ? {
            impliedNotes: Array.from(new Set([...ai.impliedNotes, ...local.impliedNotes])),
            impliedStyles: Array.from(new Set([...ai.impliedStyles, ...local.impliedStyles])),
            impliedOccasions: Array.from(new Set([...ai.impliedOccasions, ...local.impliedOccasions])),
            referencePerfumeIds: local.referencePerfumeIds,
          }
        : local;
    }

    const { results, relaxed } = getRecommendations(preferences, textHints);

    return NextResponse.json({ success: true, relaxed, results });
  } catch (error) {
    console.error("Erro na rota /api/recommend:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Não foi possível calcular as recomendações agora. Tente novamente em instantes.",
      },
      { status: 500 }
    );
  }
}
