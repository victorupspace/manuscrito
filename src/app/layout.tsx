import type { Metadata, Viewport } from "next";
import { EB_Garamond, Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// EB Garamond — alternativa open-source fiel ao Garamond Premier Pro (VBL §V).
// Usada para display, headings e corpo editorial.
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
  themeColor: "#f5f1e8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${ebGaramond.variable} h-full antialiased`}
      style={{ ["--font-display" as string]: "var(--font-serif)" }}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
