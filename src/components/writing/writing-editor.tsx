"use client";

import { useCallback, useMemo, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";

import { EditorToolbar } from "@/components/writing/editor-toolbar";
import { createEditorExtensions } from "@/lib/editor/extensions";
import { normalizeTiptapContent } from "@/lib/editor/serialize";
import { getDocumentStats } from "@/lib/editor/stats";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useWritingAutosave } from "@/hooks/use-writing-autosave";
import { useWritingShortcuts } from "@/hooks/use-writing-shortcuts";
import { useWritingStore } from "@/stores/writing-store";
import type { WritingAccessMode } from "@/types/editor-permissions";
import type { WritingDocumentNode } from "@/types/writing";

type WritingEditorProps = {
  userId: string;
  projectId: string;
  document: WritingDocumentNode;
  title: string;
  notes: string;
  status: WritingDocumentNode["status"];
  targetWords: number | null;
  accessMode: WritingAccessMode;
  onInitialStats: (stats: {
    wordCount: number;
    characterCount: number;
    readingTime: number;
  }) => void;
};

export function WritingEditor({
  userId,
  projectId,
  document,
  title,
  notes,
  status,
  targetWords,
  accessMode,
  onInitialStats,
}: WritingEditorProps) {
  const online = useOnlineStatus();
  const focusMode = useWritingStore((state) => state.focusMode);
  const toggleFocusMode = useWritingStore((state) => state.toggleFocusMode);
  const setStats = useWritingStore((state) => state.setStats);
  const [content, setContent] = useState<{
    contentJson: JSONContent;
    contentHtml: string;
    plainText: string;
  }>(() => ({
    contentJson: normalizeTiptapContent(document.contentJson),
    contentHtml: document.contentHtml ?? "",
    plainText: document.plainText ?? "",
  }));

  const editable = accessMode === "master" || accessMode === "editor";
  const initialContent = useMemo(
    () => normalizeTiptapContent(document.contentJson),
    [document.contentJson],
  );

  const editor = useEditor({
    extensions: createEditorExtensions({
      placeholder: "Comece a escrever...",
    }),
    content: initialContent,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "manuscrito-editor",
      },
    },
    onCreate: ({ editor }) => {
      const stats = getDocumentStats(editor.getText());
      setStats(stats);
      onInitialStats(stats);
    },
    onUpdate: ({ editor }) => {
      const plainText = editor.getText();
      const next = {
        contentJson: editor.getJSON(),
        contentHtml: editor.getHTML(),
        plainText,
      };
      setContent(next);
      setStats(getDocumentStats(plainText));
    },
  });

  const forceSave = useCallback(() => {
    if (!editor) return;
    const plainText = editor.getText();
    setContent({
      contentJson: editor.getJSON(),
      contentHtml: editor.getHTML(),
      plainText,
    });
  }, [editor]);

  useWritingShortcuts({
    editor,
    onSave: forceSave,
    onToggleFocus: toggleFocusMode,
  });

  useWritingAutosave({
    userId,
    documentType: document.type,
    online,
    enabled: editable,
    payload: {
      documentNodeId: document.id,
      projectId,
      title: title.trim() || "Sem título",
      contentJson: content.contentJson,
      contentHtml: content.contentHtml,
      plainText: content.plainText,
      notes,
      status,
      targetWords,
    },
  });

  return (
    <section className="min-w-0">
      <div className="sticky top-[65px] z-20 mx-auto max-w-3xl px-4 sm:px-6">
        <EditorToolbar editor={editor} compact={focusMode} />
      </div>
      {!online ? (
        <p className="mx-auto mt-4 max-w-3xl px-4 font-serif text-[0.84rem] italic text-brand-bordo sm:px-6">
          Você está offline. Seu texto será salvo neste dispositivo.
        </p>
      ) : null}
      <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-6 sm:px-6">
        <EditorContent editor={editor} />
      </div>
    </section>
  );
}
