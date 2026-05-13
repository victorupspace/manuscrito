"use server";

import { updateDocumentNodeOrderAction } from "@/features/writing/actions/update-document-node-order";
import type { DocumentOrderInput } from "@/lib/validations/document-node";

export async function updateCorkboardOrderAction(input: DocumentOrderInput) {
  return updateDocumentNodeOrderAction(input);
}
