import { ParsedFreeText } from "./textParser";
import { NOTES, STYLES, OCCASIONS, NOTE_MAP } from "@/data/notes";
import { Perfume } from "@/types/perfume";
import { UserPreferences } from "@/types/preferences";
import type { ScoreBreakdownItem } from "./recommendation";

// Modelo gratuito do Gemini (Google AI Studio). Sem custo, sem cartão de
// crédito, com um limite generoso de requisições por dia — ideal pra um
// projeto pessoal como este.
const GEMINI_MODEL = "gemini-3.1-flash-lite";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Chama a API do Gemini com um prompt de sistema + texto do usuário.
 * Centraliza a lógica de rede pras duas funções abaixo não repetirem código.
 *
 * Só roda quando GEMINI_API_KEY está configurada no servidor — nunca no
 * navegador, então a chave nunca fica exposta no frontend. Se a chave não
 * existir, ou a chamada falhar por qualquer motivo (API fora do ar, erro
 * de rede, resposta inválida), retorna null e quem chamou volta a usar o
 * caminho sem IA.
 *
 * Como configurar: veja o arquivo .env.example na raiz do projeto.
 */
async function callGemini(systemPrompt: string, userPrompt: string, asJson: boolean): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: asJson ? 0.2 : 0.7,
          maxOutputTokens: asJson ? 300 : 220,
          ...(asJson ? { responseMimeType: "application/json" } : {}),
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Gemini respondeu com status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === "string" && text.trim().length > 0 ? text.trim() : null;
  } catch (error) {
    console.error("Falha ao consultar o Gemini:", error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Integração opcional com a API do Gemini para interpretar o texto livre
 * do usuário com mais precisão do que o interpretador local (textParser.ts).
 */
export async function parseFreeTextWithAI(text: string): Promise<ParsedFreeText | null> {
  const noteIds = NOTES.map((n) => n.id).join(", ");
  const styleIds = STYLES.map((s) => s.id).join(", ");
  const occasionIds = OCCASIONS.map((o) => o.id).join(", ");

  const systemPrompt = `Você extrai preferências de perfume de um texto em português.
Responda SOMENTE com um JSON no formato:
{"impliedNotes": string[], "impliedStyles": string[], "impliedOccasions": string[]}
Use apenas valores destas listas quando fizer sentido:
notas: ${noteIds}
estilos: ${styleIds}
ocasioes: ${occasionIds}
Se nada se aplicar, use arrays vazios. Não inclua nenhum texto fora do JSON.`;

  const content = await callGemini(systemPrompt, text, true);
  if (!content) return null;

  try {
    const parsed = JSON.parse(content);
    return {
      impliedNotes: Array.isArray(parsed.impliedNotes) ? parsed.impliedNotes : [],
      impliedStyles: Array.isArray(parsed.impliedStyles) ? parsed.impliedStyles : [],
      impliedOccasions: Array.isArray(parsed.impliedOccasions) ? parsed.impliedOccasions : [],
      referencePerfumeIds: [],
    };
  } catch (error) {
    console.error("Gemini devolveu um JSON inválido:", error);
    return null;
  }
}

/**
 * Gera uma explicação em linguagem natural (2-3 frases) sobre por que um
 * perfume específico combina com as preferências da pessoa — usando os
 * dados já calculados pelo motor de recomendação (score, breakdown,
 * reasons) como base, pra IA não "inventar" nada.
 */
export async function generateExplanation(
  perfume: Perfume,
  prefs: UserPreferences,
  score: number,
  breakdown: ScoreBreakdownItem[],
  reasons: string[]
): Promise<string | null> {
  const notes = Array.from(new Set([...perfume.notesTop, ...perfume.notesHeart, ...perfume.notesBase]))
    .map((id) => NOTE_MAP[id]?.label ?? id)
    .join(", ");

  const breakdownText = breakdown.map((b) => `${b.label}: ${Math.round(b.earned)}/${b.max}`).join("; ");

  const systemPrompt = `Você é um consultor de perfumaria experiente e caloroso, escrevendo em português do Brasil.
Com base nos dados do perfume e nas preferências da pessoa, escreva uma explicação curta (2 a 3 frases)
e natural sobre por que esse perfume é uma boa recomendação para ela especificamente.
Seja específico — cite notas, ocasião ou outro detalhe real dos dados fornecidos.
Não invente informações que não estejam nos dados fornecidos. Não use markdown nem listas.
Responda apenas com o texto da explicação, nada mais.`;

  const userPrompt = `Perfume: ${perfume.brand} ${perfume.name}
Descrição: ${perfume.description}
Notas: ${notes}
Compatibilidade calculada: ${score}%
Detalhamento da pontuação: ${breakdownText || "não disponível"}
Motivos já identificados pelo sistema: ${reasons.join("; ") || "nenhum"}

Preferências da pessoa:
- Notas que gosta: ${prefs.likedNotes.map((n) => NOTE_MAP[n]?.label ?? n).join(", ") || "não informado"}
- Notas que evita: ${prefs.dislikedNotes.map((n) => NOTE_MAP[n]?.label ?? n).join(", ") || "nenhuma"}
- Ocasião desejada: ${prefs.occasions.join(", ") || "não informado"}
- Intensidade desejada: ${prefs.intensity}
${prefs.freeText ? `- O que ela escreveu: "${prefs.freeText}"` : ""}`;

  return callGemini(systemPrompt, userPrompt, false);
}
