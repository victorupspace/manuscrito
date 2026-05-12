import { BookOpen, Feather, FileText, type LucideIcon } from "lucide-react";

export const PROJECT_TYPES = ["short_story", "book", "draft"] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  short_story: "Conto",
  book: "Livro",
  draft: "Rascunho",
};

export const PROJECT_TYPE_DESCRIPTIONS: Record<ProjectType, string> = {
  short_story:
    "Para histórias curtas, narrativas fechadas e ideias que pedem concisão.",
  book: "Para projetos longos, capítulos, partes, cenas e organização profunda.",
  draft:
    "Para ideias soltas, cenas iniciais, anotações e materiais ainda em formação.",
};

export const PROJECT_TYPE_ICONS: Record<ProjectType, LucideIcon> = {
  short_story: Feather,
  book: BookOpen,
  draft: FileText,
};

export const PROJECT_TYPE_OPTIONS: Array<{
  id: ProjectType;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  enabled: boolean;
}> = [
  {
    id: "short_story",
    label: PROJECT_TYPE_LABELS.short_story,
    description: PROJECT_TYPE_DESCRIPTIONS.short_story,
    icon: PROJECT_TYPE_ICONS.short_story,
    accent: "text-brand-bordo",
    enabled: true,
  },
  {
    id: "book",
    label: PROJECT_TYPE_LABELS.book,
    description: PROJECT_TYPE_DESCRIPTIONS.book,
    icon: PROJECT_TYPE_ICONS.book,
    accent: "text-brand-sepia",
    enabled: true,
  },
  {
    id: "draft",
    label: PROJECT_TYPE_LABELS.draft,
    description: PROJECT_TYPE_DESCRIPTIONS.draft,
    icon: PROJECT_TYPE_ICONS.draft,
    accent: "text-brand-dourado",
    enabled: true,
  },
];
