"use client";

import { useMemo } from "react";

import { getDocumentStats } from "@/lib/editor/stats";

export function useDocumentStats(plainText: string) {
  return useMemo(() => getDocumentStats(plainText), [plainText]);
}
