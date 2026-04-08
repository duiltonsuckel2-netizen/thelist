# Meus Lugares · Florianópolis — ARCHITECTURE

> Guia pessoal interativo de lugares pra conhecer em Floripa.
> Editorial, dark mode, mobile-first, 100% client-side.

---

## TL;DR

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de produção em /dist
npm run preview    # serve o build local
npm run typecheck  # tsc strict
npm test           # vitest run (39 tests)
npm run test:watch # modo watch
```

Sem backend, sem auth, sem banco. Os dados moram no `localStorage` do navegador.

---

## Stack & por quê

| Camada | Escolha | Por quê (uma frase) |
|---|---|---|
| **Build / dev server** | Vite 5 | SPA puro sem SSR/rotas/API → Vite vence Next em DX, build time e simplicidade. |
| **Framework UI** | React 18 | Maturidade, ecossistema e por casar com a estética componentizada do briefing. |
| **Linguagem** | TypeScript strict | A taxonomia tem 8 categorias × 14 culinárias × tags livres — TS captura typos no dia 1 e documenta o `Place`. |
| **Estilo** | Tailwind CSS 3 | Design editorial precisa de tokens consistentes (`gold`, `sand`, `ink`) — `tailwind.config.js` vira o design system. |
| **State / persistência** | `useState` + `useLocalStorage<T>` (com `parse` validator opcional) | Sem backend = sem necessidade de Zustand/Redux. Um hook resolve persistência reativa **e** validação de shape ao hidratar. |
| **Animações** | CSS keyframes (Tailwind) | Expand/fade/sheet-up cabem em CSS puro. -40 kB vs framer-motion. |
| **Carrossel** | `useState` + touch events | Swipe + dots não justifica embla/swiper. |
| **Modal** | Custom (sem libs) | Bottom-sheet específico do briefing, não dá pra reusar headless-ui sem custom CSS pesado. |
| **Fontes** | Playfair Display + DM Sans (Google) | Briefing pediu nominalmente — preconnect no `<head>` pra evitar FOUT. |
| **PWA** | Manifest + ícones (sem service worker) | App vira "instalável" no celular via Add to Home Screen. Sem SW ainda — não precisa de offline-first nesse momento. |
| **Testes** | Vitest (sem RTL) | Pure functions críticas (validators + filter) cobertas. Sem RTL porque component tests no v0.1 são caros e o ROI é baixo pra UI estática. |

### Anti-patterns evitados
- Sem React Router (single page).
- Sem framer-motion / motion-one (CSS dá conta).
- Sem icon library (emojis + 1 SVG inline).
- Sem date-fns / lodash / nada fora da spec.
- Sem TODO comments, sem dead code, sem código placeholder.

### Custo em produção
Hospedagem estática (Vercel/Netlify/Cloudflare Pages tier free) — **R$ 0/mês**. Imagens via Unsplash CDN, sem egress próprio. Sem APIs externas em runtime, sem cold starts. Bundle alvo: < 100 kB gzipped.

---

## Estrutura de pastas

```
thelist/
├── index.html                  # entry, manifest, fontes, iOS meta tags
├── package.json
├── tsconfig.json               # strict mode + noUnusedLocals
├── vite.config.js
├── vitest.config.ts            # config dos testes
├── tailwind.config.js          # design system: gold, sand, ink, fontes, animations
├── postcss.config.js
├── ARCHITECTURE.md             # você está aqui
├── public/
│   ├── manifest.webmanifest    # PWA
│   ├── icon.svg                # fonte vetorial
│   ├── icon-maskable.svg       # versão maskable (Android adaptive icons)
│   ├── icon-192.png            # PWA Android
│   ├── icon-512.png            # PWA Android + splash
│   ├── icon-maskable-512.png   # purpose=maskable
│   ├── apple-touch-icon.png    # 180x180 iOS Add to Home Screen
│   └── favicon.png             # 32x32
├── scripts/
│   └── generate-icons.mjs      # gera os PNGs a partir dos SVGs (sharp)
└── src/
    ├── main.tsx                # bootstrap React
    ├── App.tsx                 # composição de tela + state global
    ├── index.css               # @tailwind + estilos base + componentes utilitários
    ├── types.ts                # Place, CategoryId, CuisineId, PriceRange
    ├── vite-env.d.ts
    ├── hooks/
    │   └── useLocalStorage.ts  # persistência reativa + validação opcional
    ├── data/
    │   ├── taxonomy.ts         # CATEGORIES + CUISINES (source of truth dos filtros)
    │   ├── photoLibrary.ts     # moodboards de fotos placeholder do Unsplash
    │   ├── initialPlaces.ts    # 28 lugares iniciais do briefing
    │   ├── filter.ts           # filterPlaces(): pure function testável
    │   ├── filter.test.ts      # 9 testes
    │   ├── validate.ts         # parsePlace, isSafeUrl, parseInstagramHandle
    │   └── validate.test.ts    # 30 testes
    └── components/
        ├── Header.tsx          # título, contadores, barra de progresso
        ├── Filters.tsx         # chips sticky de categoria + culinária
        ├── PlaceCard.tsx       # card colapsável com toda a info
        ├── PhotoCarousel.tsx   # carrossel touch + dots
        ├── SmartImage.tsx      # <img> com fallback automático
        ├── FAB.tsx             # botão flutuante "+"
        └── AddPlaceModal.tsx   # bottom-sheet de adicionar lugar
```

### Boundaries respeitados
- **`data/`** não importa de `components/` ou `hooks/` — é o "modelo".
- **`components/`** consome `data/` e `types`, nunca o contrário.
- **`App.tsx`** é o único que combina state + persistência + composição.
- **`hooks/`** é genérico (não conhece `Place`).

---

## Decisões arquiteturais

### 1. Source of truth única pra taxonomia
`src/data/taxonomy.ts` define `CATEGORIES` e `CUISINES`. Os tipos `CategoryId` / `CuisineId` em `types.ts` são unions literais que casam com os IDs. Mudar uma categoria = mudar nos dois lugares (TS força).

### 2. Persistência versionada
Chaves do `localStorage` carregam sufixo `.v1`:
```
meus-lugares.places.v1
meus-lugares.visited.v1
meus-lugares.hideVisited.v1
```
Migrar a shape no futuro = bumpar pra `.v2` + função de migração. Hoje não tem migração porque não precisa.

### 3. Visited é uma lista separada, não flag no `Place`
Por quê: o `Place` (catálogo) é "estável", o `visited` é "estado do usuário". Separando, dá pra resetar visitados sem perder a lista, e dá pra eventualmente sincar com outros devices sem mexer no catálogo.

### 4. Galeria por mood, não por lugar
Cada lugar aponta pra um `PhotoMood` (`rooftopBar`, `pizzaWoodFire`, etc.) e o helper `photosFor()` retorna 6 URLs do Unsplash. Vantagens:
- Não precisa caçar 28 × 6 = 168 URLs únicas.
- Trocar a galeria de "todas as pizzarias" = 1 edit.
- Quando o usuário adicionar URLs próprias no modal, elas vencem.

### 5. SmartImage com fallback determinístico
Se uma URL do Unsplash quebrar, `SmartImage` substitui por outra do banco curado escolhida via hash do seed. O card nunca fica com placeholder cinza.

### 6. Carrossel sem dependência
~80 linhas de React puro com `useState` + 3 handlers de touch. Para o caso de uso (3-6 fotos), embla/swiper seriam overkill.

---

## Qualidade configurada no dia 1

- **TypeScript strict**: `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`.
- **`npm run typecheck`** roda `tsc -b --pretty`.
- **`npm run build`** roda typecheck antes de empacotar — não dá pra publicar build com erro de tipo.
- **Vitest** com 39 testes cobrindo as boundaries críticas (validators de URL/Instagram/Place + lógica de filtro).
- **Validação de shape no hydrate** do localStorage — dado corrompido (DevTools, migração de versão, bug) cai pro `INITIAL_PLACES` em vez de quebrar a tela.
- **Logging gated por DEV** — `console.warn` só em `import.meta.env.DEV`. Zero ruído no console do usuário final.
- **Tailwind config tipada** (JSDoc `@type`).
- **Sem ESLint** por enquanto: o projeto é pequeno o suficiente pra TS strict + Vite cobrirem. Se virar time, adicionar `eslint-config-airbnb-typescript` + Prettier.

---

## O que NÃO existe e por quê

| Coisa | Por que não tem |
|---|---|
| Backend / API | Briefing: "sem backend — tudo client-side". |
| Auth | App pessoal, dispositivo único. Quando precisar, login mágico via Supabase. |
| Docker Compose | Sem serviços locais (banco/cache). Dev = `npm run dev`, sem fricção. |
| `.env` | Nenhum segredo, nenhuma URL de API. Quando precisar, criar `.env.example`. |
| Testes | Pode crescer pra Vitest + Testing Library quando aparecer lógica não-trivial. Hoje a complexidade é sobre UI estática. |
| ESLint | Coberto pelo TS strict. Adicionar quando o projeto crescer. |
| CI | Sem deploy target definido ainda. Quando tiver, GitHub Actions com `npm ci && npm run build`. |
| PWA / offline | Não pedido. Já roda offline depois do primeiro load (assets cacheados pelo browser). |

---

## Roadmap natural (não implementado)

São extensões óbvias que **não** foram feitas pra respeitar o escopo do briefing:

1. **Export/import** do JSON de lugares (botão no header).
2. **Editar / deletar** lugar (long-press no card).
3. **Tags próprias** no formulário de adicionar.
4. **Ordenação** (preço, alfabético, recém-adicionados).
5. **Mapa** com pins (Leaflet + tile gratuito).
6. **PWA** com manifest + service worker.
7. **Sync** opcional via Supabase pra usar em mais de um dispositivo.

Cada um desses tem que justificar sua existência quando virar prioridade.
