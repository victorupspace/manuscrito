import { z } from "zod";
import { DOCUMENT_NODE_TYPES } from "@/constants/document-node-types";

export const documentNodeSchema = z.object({
  projectId: z.string().min(1),
  parentId: z.string().min(1).nullable().optional(),
  type: z.enum(DOCUMENT_NODE_TYPES),
  title: z.string().trim().min(1).max(180),
  summary: z.string().trim().max(2000).nullable().optional(),
  orderIndex: z.number().int().nonnegative(),
  status: z.enum(["draft", "revising", "done", "archived"]).default("draft"),
});

export type DocumentNodeInput = z.infer<typeof documentNodeSchema>;
