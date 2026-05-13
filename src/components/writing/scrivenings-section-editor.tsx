"use client";

import { useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { useWritingAutosave } from "@/hooks/use-writing-autosave";
import { createEditorExtensions } from "@/lib/editor/extensions";
import { normalizeTiptapContent } from "@/lib/editor/serialize";
import type { WritingAccessMode } from "@/types/editor-permissions";
import type { WritingDocumentNode } from "@/types/writing";

export function ScriveningsSectionEditor({
  document,
  accessMode,
}: {
  document: WritingDocumentNode;
  accessMode: WritingAccessMode;
}) {
  const readOnly = accessMode === "viewer" || accessMode === "commenter";
  const online = useOnlineStatus();
  const [title] = useState(document.title);
  const [contentJson, setContentJson] = useState(document.contentJson);
  const [contentHtml, setContentHtml] = useState(document.contentHtml ?? "");
  const [plainText, setPlainText] = useState(document.plainText ?? "");
  const extensions = useMemo(
    () =>
      createEditorExtensions({
        placeholder: `Continue ${document.title.toLowerCase()}...`,
      }),
    [document.title],
  );
  const editor = useEditor({
    extensions,
    content: normalizeTiptapContent(document.contentJson),
    editable: !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "manuscrito-editor manuscrito-editor-compact min-h-56 px-0 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => {
      setContentJson(instance.getJSON());
      setContentHtml(instance.getHTML());
      setPlainText(instance.getText());
    },
  });

  useWritingAutosave({
    userId: document.userId,
    documentType: document.type,
    enabled: !readOnly,
    online,
    debounceMs: 900,
    remoteDebounceMs: 2400,
    payload: {
      documentNodeId: document.id,
      projectId: document.projectId,
      title,
      contentJson,
      contentHtml,
      plainText,
      notes: document.notes,
      status: document.status,
      targetWords: document.targetWords,
    },
  });

  return (
    <section className="border-b border-brand-bordo/10 py-8">
      <header className="mx-auto max-w-3xl">
        <p className="font-serif text-[0.66rem] uppercase tracking-[0.24em] text-brand-tinta/55">
          {document.wordCount.toLocaleString("pt-BR")} palavras
        </p>
        <h3 className="mt-1 font-serif text-[1.7rem] italic text-brand-bordo">
          {document.title}
        </h3>
      </header>
      <div className="mx-auto mt-3 max-w-3xl">
        <EditorContent editor={editor} />
      </div>
    </section>
  );
}
