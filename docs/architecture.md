# Arquitetura

## App Router

O projeto usa Next.js com App Router, TypeScript, Tailwind CSS e estrutura em `/src`. A página inicial atual é temporária e existe apenas para validar a base técnica.

## Supabase

Os clientes base ficam em `src/lib/supabase`. O client browser e o server client são preparados para uso futuro, sem autenticação visual nesta fase. Variáveis reais devem ficar em `.env.local`.

## Dexie e local-first

`src/lib/db/local-db.ts` define o IndexedDB local para projetos, documentos, personagens, lugares, pesquisa, metas, sessões de escrita e fila de sincronização. A base já considera autosave local, edição offline e sincronização futura com Supabase.

## TipTap

`src/components/editor/base-editor.tsx` é um editor mínimo e reutilizável. Ele expõe `onUpdate` com JSON, HTML, texto puro e contagem de palavras para autosave externo.

## Zustand

Stores iniciais separam estado de editor, projetos e sincronização. Elas evitam acoplamento com UI final e podem evoluir conforme as telas forem criadas.

## PWA

O manifest fica em `public/manifest.json`, com nome, idioma, orientação e cores iniciais. O service worker é configurado via `@serwist/next` e fica desabilitado em desenvolvimento.
