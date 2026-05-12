import { BookMarked, Layers3, NotebookPen, TrendingUp } from "lucide-react";

export const WRITING_INSIGHTS = [
  {
    title: "Comece pela promessa da história",
    text: "Antes de escrever muitas páginas, defina qual experiência você quer entregar ao leitor.",
    icon: BookMarked,
  },
  {
    title: "Organize cenas, não apenas capítulos",
    text: "Cenas ajudam a transformar uma ideia ampla em partes menores e mais fáceis de desenvolver.",
    icon: Layers3,
  },
  {
    title: "Rascunhos existem para liberar ideias",
    text: "Nem todo texto precisa nascer pronto. Use rascunhos para testar caminhos.",
    icon: NotebookPen,
  },
  {
    title: "Acompanhe seu volume de escrita",
    text: "Ver a quantidade de palavras escritas ajuda a criar ritmo e perceber evolução.",
    icon: TrendingUp,
  },
] as const;
