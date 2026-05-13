import type { Metadata, Viewport } from "next";
import { EB_Garamond, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

/**
 * Tipografia do sistema
 * ─────────────────────
 * 1. Cossette Texte (Google Fonts via <link>) — fonte principal de UI:
 *    títulos, corpo, labels, navegação. O catálogo estático do
 *    `next/font/google` não a expõe, então carregamos via <link>.
 *
 * 2. Plus Jakarta Sans (Google Fonts via <link>, variable font) — fonte
 *    secundária para números densos (métricas, contadores), badges, UI
 *    ultra-densa, ou onde a Cossette ficar muito serifada/quente.
 *
 * 3. EB Garamond — preservada apenas para o editor de escrita longa
 *    (.manuscrito-editor) onde a serifa humanista clássica favorece o
 *    fluxo de leitura. Não aparece mais no dashboard.
 *
 * Iconografia
 * ───────────
 * Material Symbols Outlined (Google Fonts) — carregada via <link> e
 * exposta como classe `material-symbols-outlined`. Componente <Icon> em
 * `@/components/ui/icon` encapsula o uso. Lucide-react permanece em
 * áreas ainda não migradas (auth, landing, backoffice, editor).
 */
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Manuscrito — Escreva, organize e desenvolva suas histórias",
  description:
    "Ferramenta brasileira para autores que querem estruturar livros, contos, capítulos, cenas, notas e pesquisas com foco, clareza e segurança.",
  applicationName: "Manuscrito",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ece6d3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistMono.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/*
         * Carregamento via <link> no App Router (não há _document.js).
         * O lint sugere a Pages API antiga — supressão proposital.
         */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cossette+Texte:wght@400;700&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,300..700,0..1,-50..200&display=optional"
        />
      </head>
      <body className="flex min-h-full flex-col font-ui">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
