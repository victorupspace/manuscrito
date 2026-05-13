export const DOCUMENT_NODE_TYPES = [
  "part",
  "chapter",
  "scene",
  "note",
  "research",
  "draft",
  "short_story_main",
  "document",
] as const;

export type DocumentNodeType = (typeof DOCUMENT_NODE_TYPES)[number];
