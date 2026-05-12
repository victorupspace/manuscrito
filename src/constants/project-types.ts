export const PROJECT_TYPES = [
  "novel",
  "nonfiction",
  "thesis",
  "script",
  "free",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
