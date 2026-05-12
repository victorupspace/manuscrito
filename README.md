# Manuscrito

Base técnica inicial do Manuscrito, uma ferramenta brasileira mobile-first para escrita longa e organização de livros por autores humanos.

## Stack

- Next.js App Router com TypeScript e `/src`
- Tailwind CSS v4 e shadcn/ui
- TipTap para editor rico preparado para escrita longa
- Supabase para sincronização e autenticação futuras
- Dexie.js/IndexedDB para persistência local e autosave
- Zustand para estado client-side
- React Hook Form e Zod para formulários futuros
- dnd-kit para ordenação futura de estruturas
- PWA com manifest e service worker
- ESLint e Prettier

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
# Supabase — cliente público (browser/SSR)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase — somente servidor (RLS bypass para fluxos administrativos)
SUPABASE_SERVICE_ROLE_KEY=

# Backoffice — login local temporário e assinatura do cookie de sessão
BACKOFFICE_ADMIN_EMAIL=
BACKOFFICE_ADMIN_PASSWORD=
BACKOFFICE_SESSION_SECRET=
```

- `SUPABASE_SERVICE_ROLE_KEY` só deve ser usada em código server-side controlado (`src/lib/supabase/admin.ts`) e nunca no client.
- `BACKOFFICE_SESSION_SECRET` pode ser gerada com `openssl rand -base64 32`.
- Detalhes do fluxo administrativo em [`docs/backoffice.md`](docs/backoffice.md).

## Scripts

- `npm run dev`: inicia o servidor local
- `npm run build`: gera build de produção
- `npm run start`: serve o build de produção
- `npm run lint`: executa ESLint
- `npm run format`: formata com Prettier
- `npm run typecheck`: valida TypeScript

## Estrutura

- `src/app`: App Router, layout, página temporária e estilos globais
- `src/components/ui`: componentes shadcn/ui
- `src/components/editor`: componentes do editor TipTap
- `src/features`: módulos de produto futuros
- `src/lib`: integrações e infraestrutura
- `src/stores`: stores Zustand
- `src/types`: tipos de domínio
- `src/hooks`: hooks reutilizáveis
- `src/constants`: listas e enums compartilhados
- `docs`: documentação inicial de arquitetura e produto
