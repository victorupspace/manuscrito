"use client";

import { useEffect, useState } from "react";

import { DocumentTitleInput } from "@/components/writing/document-title-input";
import { MobileWritingNavigation } from "@/components/writing/mobile-writing-navigation";
import { ProjectOutlineSidebar } from "@/components/writing/project-outline-sidebar";
import { WritingContextPanel } from "@/components/writing/writing-context-panel";
import { WritingEditor } from "@/components/writing/writing-editor";
import { WritingTopbar } from "@/components/writing/writing-topbar";
import { useWritingStore } from "@/stores/writing-store";
import type { WritingAccessMode } from "@/types/editor-permissions";
import type { ProjectWritingData } from "@/types/writing";

export function WritingShell({
  data,
  accessMode = "master",
}: {
  data: ProjectWritingData;
  accessMode?: WritingAccessMode;
}) {
  const { project, documentNodes, activeDocument } = data;
  const focusMode = useWritingStore((state) => state.focusMode);
  const setProjectId = useWritingStore((state) => state.setProjectId);
  const setCurrentDocumentNodeId = useWritingStore(
    (state) => state.setCurrentDocumentNodeId,
  );
  const setStats = useWritingStore((state) => state.setStats);
  const setAccessMode = useWritingStore((state) => state.setAccessMode);

  const [title, setTitle] = useState(activeDocument.title);
  const [notes, setNotes] = useState(activeDocument.notes ?? "");
  const [status, setStatus] = useState(activeDocument.status);
  const [targetWords, setTargetWords] = useState(activeDocument.targetWords);

  const readOnly = accessMode === "viewer" || accessMode === "commenter";

  useEffect(() => {
    setProjectId(project.id);
    setCurrentDocumentNodeId(activeDocument.id);
    setAccessMode(accessMode);
    setStats({
      wordCount: activeDocument.wordCount,
      characterCount: activeDocument.characterCount,
      readingTime: activeDocument.readingTime,
    });
  }, [
    accessMode,
    activeDocument.characterCount,
    activeDocument.id,
    activeDocument.readingTime,
    activeDocument.wordCount,
    project.id,
    setAccessMode,
    setCurrentDocumentNodeId,
    setProjectId,
    setStats,
  ]);

  return (
    <div className="min-h-dvh bg-brand-marfim text-brand-carvao">
      <WritingTopbar
        project={project}
        document={{ ...activeDocument, title }}
      />

      <div
        className={
          focusMode
            ? "grid min-h-[calc(100dvh-65px)] grid-cols-1"
            : "grid min-h-[calc(100dvh-65px)] grid-cols-1 lg:grid-cols-[17.5rem_minmax(0,1fr)] xl:grid-cols-[17.5rem_minmax(0,1fr)_20rem]"
        }
      >
        {!focusMode ? (
          <div className="hidden lg:block">
            <ProjectOutlineSidebar
              project={project}
              nodes={documentNodes}
              activeNodeId={activeDocument.id}
            />
          </div>
        ) : null}

        <main className="min-w-0">
          <DocumentTitleInput
            value={title}
            readOnly={readOnly}
            onChange={setTitle}
          />
          <WritingEditor
            userId={project.userId}
            projectId={project.id}
            document={activeDocument}
            title={title}
            notes={notes}
            status={status}
            targetWords={targetWords}
            accessMode={accessMode}
            onInitialStats={setStats}
          />
        </main>

        {!focusMode ? (
          <div className="hidden xl:block">
            <WritingContextPanel
              document={activeDocument}
              notes={notes}
              status={status}
              targetWords={targetWords}
              onNotesChange={setNotes}
              onStatusChange={setStatus}
              onTargetWordsChange={setTargetWords}
              readOnly={readOnly}
            />
          </div>
        ) : null}
      </div>

      <MobileWritingNavigation
        project={project}
        nodes={documentNodes}
        activeDocument={activeDocument}
        notes={notes}
        status={status}
        targetWords={targetWords}
        onNotesChange={setNotes}
        onStatusChange={setStatus}
        onTargetWordsChange={setTargetWords}
        readOnly={readOnly}
      />
    </div>
  );
}
