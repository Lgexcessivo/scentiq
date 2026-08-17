# ScentIQ — AI Perfume Finder

Site de recomendação de perfumes: você conta suas notas favoritas, orçamento,
ocasião e estilo, e o ScentIQ cruza tudo isso com um catálogo de 37 perfumes
para mostrar as combinações com maior compatibilidade.

## Stack

- Next.js 14 (App Router) + TypeScript
- React 18
- Tailwind CSS
- Sem banco de dados externo — o catálogo vive em `data/perfumes.ts`
- Integração opcional com a API da OpenAI para interpretar texto livre
  (funciona 100% sem ela, usando um interpretador local)

## Estrutura de pastas

```
app/
  api/recommend/route.ts   -> endpoint que calcula as recomendações
  layout.tsx                -> layout raiz (fontes, SEO)
  page.tsx                  -> página inicial
  globals.css                -> estilos globais (Tailwind + tema)
  icon.svg                   -> favicon
components/                  -> todos os componentes visuais
data/
  notes.ts                   -> notas, ocasiões, estações, estilos
  perfumes.ts                 -> catálogo de perfumes (37 itens)
lib/
  recommendation.ts           -> motor de pontuação/compatibilidade
  textParser.ts                -> interpretador local de texto livre
  ai.ts                        -> integração opcional com OpenAI
  validate.ts                  -> validação dos dados do formulário
types/                         -> tipos TypeScript do projeto
```

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e, se quiser, preencha
`OPENAI_API_KEY`. Sem ela, o site funciona normalmente.

## Como adicionar um novo perfume

Abra `data/perfumes.ts` e adicione um novo objeto no array `PERFUMES`,
seguindo o mesmo formato dos que já existem. Os IDs de notas, ocasiões,
estilos etc. válidos estão listados em `data/notes.ts`.

## Deploy

Este projeto está pronto para deploy na Vercel (veja o guia completo
enviado junto com este projeto).
