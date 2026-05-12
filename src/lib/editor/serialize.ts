import type { JSONContent } from "@tiptap/core";

export const EMPTY_TIPTAP_DOCUMENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

export function normalizeTiptapContent(content: unknown): JSONContent {
  if (
    content &&
    typeof content === "object" &&
    "type" in content &&
    (content as { type?: unknown }).type === "doc"
  ) {
    return content as JSONContent;
  }

  return EMPTY_TIPTAP_DOCUMENT;
}
