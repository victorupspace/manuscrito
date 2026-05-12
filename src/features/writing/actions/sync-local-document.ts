"use server";

import type { DocumentNodeSaveInput } from "@/lib/validations/document-node";

import { saveDocumentNodeAction } from "./save-document-node";

export async function syncLocalDocumentAction(input: DocumentNodeSaveInput) {
  return saveDocumentNodeAction(input);
}
