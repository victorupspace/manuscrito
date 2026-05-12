import { z } from "zod";

import { DOCUMENT_NODE_TYPES } from "@/constants/document-node-types";

export const documentNodeCreateSchema = z.object({
  projectId: z.string().uuid(),
  parentId: z.string().uuid().nullable().optional(),
  type: z.enum(DOCUMENT_NODE_TYPES),
  title: z.string().trim().min(1, "Informe um título.").max(160),
});

export const documentNodeSaveSchema = z.object({
  documentNodeId: z.string().uuid(),
  projectId: z.string().uuid(),
  title: z.string().trim().min(1, "Informe um título.").max(160),
  contentJson: z.unknown().nullable(),
  contentHtml: z.string(),
  plainText: z.string(),
  notes: z.string().nullable().optional(),
  status: z.enum(["draft", "in_review", "completed", "archived"]).optional(),
  targetWords: z.number().int().positive().nullable().optional(),
});

export type DocumentNodeCreateInput = z.infer<typeof documentNodeCreateSchema>;
export type DocumentNodeSaveInput = z.infer<typeof documentNodeSaveSchema>;
