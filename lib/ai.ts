import { ParsedFreeText } from "./textParser";
import { NOTES, STYLES, OCCASIONS } from "@/data/notes";

/**
 * Integração opcional com a API da OpenAI para interpretar o texto livre
 * do usuário com mais precisão do que o interpretador local (textParser.ts).
 *
 * Esta função só é chamada pela rota /api/recommend quando a variável de
 * ambiente OPENAI_API_KEY está configurada no servidor — ela NUNCA roda
 * no navegador, então a chave nunca fica exposta no frontend.
 *
 * Se a chave não existir, ou se a chamada falhar por qualquer motivo
 * (API fora do ar, erro de rede, resposta inválida), a função retorna
 * null e a rota volta automaticamente a usar o interpretador local.
 *
 * Como configurar: veja o arquivo .env.example na raiz do projeto.
 */
export async function parseFreeTextWithAI(text: string): Promise<ParsedFreeText | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

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
Se nada se aplicar, use arrays vazios.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`OpenAI respondeu com status ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);

    return {
      impliedNotes: Array.isArray(parsed.impliedNotes) ? parsed.impliedNotes : [],
      impliedStyles: Array.isArray(parsed.impliedStyles) ? parsed.impliedStyles : [],
      impliedOccasions: Array.isArray(parsed.impliedOccasions) ? parsed.impliedOccasions : [],
      referencePerfumeIds: [],
    };
  } catch (error) {
    console.error("Falha ao consultar a IA, usando interpretador local:", error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
