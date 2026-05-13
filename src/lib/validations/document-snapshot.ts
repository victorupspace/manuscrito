import { z } from "zod";

export const documentSnapshotCreateSchema = z.object({
  documentNodeId: z.string().uuid(),
  projectId: z.string().uuid(),
  label: z.string().trim().max(120).nullable().optional(),
});

export const documentSnapshotRestoreSchema = z.object({
  snapshotId: z.string().uuid(),
  documentNodeId: z.string().uuid(),
  projectId: z.string().uuid(),
});

export type DocumentSnapshotCreateInput = z.infer<
  typeof documentSnapshotCreateSchema
>;
export type DocumentSnapshotRestoreInput = z.infer<
  typeof documentSnapshotRestoreSchema
>;
