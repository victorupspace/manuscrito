"use server";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { getDocumentSnapshots } from "@/features/writing/services/get-document-snapshots";
import type { DocumentSnapshot } from "@/types/writing";

export async function listDocumentSnapshotsAction(
  documentNodeId: string,
): Promise<
  | { status: "ok"; snapshots: DocumentSnapshot[] }
  | { status: "error"; message: string }
> {
  const profile = await requireApprovedUser();

  try {
    const snapshots = await getDocumentSnapshots({
      documentNodeId,
      userId: profile.authUserId,
    });
    return { status: "ok", snapshots };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Falha ao carregar versões.",
    };
  }
}
