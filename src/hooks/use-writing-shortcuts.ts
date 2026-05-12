"use client";

import { useEffect } from "react";
import type { Editor } from "@tiptap/react";

export function useWritingShortcuts({
  editor,
  onSave,
  onToggleFocus,
}: {
  editor: Editor | null;
  onSave: () => void;
  onToggleFocus: () => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;
      if (!mod) return;

      const key = event.key.toLowerCase();

      if (key === "s") {
        event.preventDefault();
        onSave();
      }

      if (key === ".") {
        event.preventDefault();
        onToggleFocus();
      }

      if (key === "k") {
        event.preventDefault();
        const previous = editor?.getAttributes("link").href as
          | string
          | undefined;
        const href = window.prompt("Link", previous ?? "");
        if (href === null || !editor) return;
        if (!href) {
          editor.chain().focus().unsetLink().run();
          return;
        }
        editor.chain().focus().setLink({ href }).run();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editor, onSave, onToggleFocus]);
}
