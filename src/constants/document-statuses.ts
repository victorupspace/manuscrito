import type { DocumentStatus } from "@/types/writing";

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  idea: "Ideia",
  draft: "Rascunho",
  in_progress: "Em andamento",
  in_review: "Em revisão",
  review: "Revisar",
  completed: "Concluído",
  archived: "Arquivado",
};

export const DOCUMENT_STATUS_OPTIONS: Array<{
  value: DocumentStatus;
  label: string;
}> = [
  { value: "idea", label: "Ideia" },
  { value: "draft", label: "Rascunho" },
  { value: "in_progress", label: "Em andamento" },
  { value: "in_review", label: "Em revisão" },
  { value: "review", label: "Revisar" },
  { value: "completed", label: "Concluído" },
  { value: "archived", label: "Arquivado" },
];
