export const SUPPORTED_LANGUAGES = [
  "pt-BR",
  "pt-PT",
  "en-US",
  "en-GB",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
