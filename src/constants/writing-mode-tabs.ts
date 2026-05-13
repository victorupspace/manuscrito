import {
  BookOpenText,
  Columns3,
  CopyCheck,
  Goal,
  LayoutDashboard,
  ListTree,
  Rows3,
} from "lucide-react";

import type { ActiveWritingMode } from "@/types/writing";

export const WRITING_MODE_TABS: Array<{
  id: ActiveWritingMode;
  label: string;
  shortLabel: string;
  description: string;
  icon: typeof BookOpenText;
}> = [
  {
    id: "editor",
    label: "Escrever",
    shortLabel: "Escrever",
    description: "Documento único com TipTap e autosave.",
    icon: BookOpenText,
  },
  {
    id: "binder",
    label: "Estrutura",
    shortLabel: "Estrutura",
    description: "Árvore viva do projeto.",
    icon: ListTree,
  },
  {
    id: "corkboard",
    label: "Quadro",
    shortLabel: "Quadro",
    description: "Cards narrativos reorganizáveis.",
    icon: LayoutDashboard,
  },
  {
    id: "outliner",
    label: "Outline",
    shortLabel: "Outline",
    description: "Metadados em visão estrutural.",
    icon: Columns3,
  },
  {
    id: "scrivenings",
    label: "Manuscrito contínuo",
    shortLabel: "Contínuo",
    description: "Leitura e escrita em sequência.",
    icon: Rows3,
  },
  {
    id: "snapshots",
    label: "Snapshots",
    shortLabel: "Versões",
    description: "Versões salvas do documento atual.",
    icon: CopyCheck,
  },
  {
    id: "targets",
    label: "Metas",
    shortLabel: "Metas",
    description: "Progresso por projeto e documento.",
    icon: Goal,
  },
];
