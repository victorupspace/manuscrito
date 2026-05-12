export const DOCUMENT_NODE_TYPES = [
  "part",
  "chapter",
  "scene",
  "note",
  "research",
] as const;

export type DocumentNodeType = (typeof DOCUMENT_NODE_TYPES)[number];
