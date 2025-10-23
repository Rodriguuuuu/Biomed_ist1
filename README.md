# IST BME — GPA & Matches (Next.js + TS + Tailwind)

Local‑first, sem chamadas externas. Publica facilmente em Vercel com proteção por Basic Auth.

## Desenvolvimento
```bash
pnpm i # ou npm/yarn
pnpm dev
```

## Build & produção
```bash
pnpm build
pnpm start
```

## Proteção (acesso privado)
No provider (ex.: Vercel), define estas variáveis de ambiente:
```
BASIC_AUTH_ENABLED=true
BASIC_AUTH_USER=ist
BASIC_AUTH_PASS=super-seguro
```
A `middleware.ts` aplica autenticação HTTP Basic a todas as rotas.

## Acessibilidade
- HTML semântico, skip link, estados de foco, WCAG 2.2 AA-alike.
- Navegação por teclado verificada nas páginas principais.

## Dados
- Notas guardadas em `localStorage` (chave `grades.v1`).
- Export/Import JSON pode ser adicionado facilmente (hooks já previstos).
