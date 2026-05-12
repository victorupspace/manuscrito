export function countWords(text: string): number {
  return text.trim().match(/\S+/g)?.length ?? 0;
}

export function countCharacters(text: string): number {
  return text.replace(/\s/g, "").length;
}

export function estimateReadingTime(wordCount: number): number {
  if (wordCount <= 0) return 0;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function getDocumentStats(text: string) {
  const wordCount = countWords(text);
  return {
    wordCount,
    characterCount: countCharacters(text),
    readingTime: estimateReadingTime(wordCount),
  };
}
