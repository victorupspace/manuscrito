import { z } from "zod";

export const documentTitleSchema = z.object({
  documentNodeId: z.string().uuid(),
  title: z.string().trim().min(1, "Informe um título.").max(160),
});

export type DocumentTitleInput = z.infer<typeof documentTitleSchema>;
