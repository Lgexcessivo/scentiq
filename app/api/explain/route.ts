import { NextResponse } from "next/server";
import { generateExplanation } from "@/lib/ai";
import { Perfume } from "@/types/perfume";
import { UserPreferences } from "@/types/preferences";
import type { ScoreBreakdownItem } from "@/lib/recommendation";

interface ExplainRequestBody {
  perfume?: Perfume;
  preferences?: UserPreferences;
  score?: number;
  breakdown?: ScoreBreakdownItem[];
  reasons?: string[];
}

// Rota separada da /api/recommend de propósito: só é chamada quando a
// pessoa abre o modal de detalhes de um perfume específico (não para os
// 12 resultados de uma vez), o que mantém o uso da API do Gemini controlado
// mesmo com a chave configurada.
export async function POST(request: Request) {
  try {
    let body: ExplainRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ explanation: null }, { status: 400 });
    }

    if (!body.perfume || !body.preferences || typeof body.score !== "number") {
      return NextResponse.json({ explanation: null }, { status: 400 });
    }

    const explanation = await generateExplanation(
      body.perfume,
      body.preferences,
      body.score,
      body.breakdown ?? [],
      body.reasons ?? []
    );

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Erro na rota /api/explain:", error);
    // Falha aqui nunca deve quebrar a experiência — só não mostra o resumo extra.
    return NextResponse.json({ explanation: null }, { status: 500 });
  }
}
