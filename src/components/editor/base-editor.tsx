"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import type { Content } from "@tiptap/core";
import { createEditorExtensions } from "@/lib/editor/extensions";
import { cn } from "@/lib/utils";

export type BaseEditorUpdate = {
  contentJson: unknown;
  contentHtml: string;
  plainText: string;
  wordCount: number;
};

type BaseEditorProps = {
  initialContent?: Content;
  placeholder?: string;
  editable?: boolean;
  characterLimit?: number;
  className?: string;
  onUpdate?: (update: BaseEditorUpdate) => void;
};

export function BaseEditor({
  initialContent,
  placeholder,
  editable = true,
  characterLimit,
  className,
  onUpdate,
}: BaseEditorProps) {
  const editor = useEditor({
    extensions: createEditorExtensions({ placeholder, characterLimit }),
    content: initialContent,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "longform-editor",
      },
    },
    onUpdate: ({ editor }) => {
      const plainText = editor.getText();

      onUpdate?.({
        contentJson: editor.getJSON(),
        contentHtml: editor.getHTML(),
        plainText,
        wordCount: editor.storage.characterCount.words(),
      });
    },
  });

  return (
    <div className={cn("editor-shell", className)}>
      <EditorContent editor={editor} />
    </div>
  );
}
