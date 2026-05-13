"use client";

import { useEffect, useState } from "react";

import { DocumentTitleInput } from "@/components/writing/document-title-input";
import { CorkboardView } from "@/components/writing/corkboard-view";
import { MobileWritingNavigation } from "@/components/writing/mobile-writing-navigation";
import { OutlinerView } from "@/components/writing/outliner-view";
import { ProjectBinder } from "@/components/writing/project-binder";
import { ProjectOutlineSidebar } from "@/components/writing/project-outline-sidebar";
import { ScriveningsView } from "@/components/writing/scrivenings-view";
import { SnapshotsPanel } from "@/components/writing/snapshots-panel";
import { WritingModeTabs } from "@/components/writing/writing-mode-tabs";
import { WritingTargetsPanel } from "@/components/writing/writing-targets-panel";
import { WritingContextPanel } from "@/components/writing/writing-context-panel";
import { WritingEditor } from "@/components/writing/writing-editor";
import { WritingTopbar } from "@/components/writing/writing-topbar";
import { useWritingStore } from "@/stores/writing-store";
import type { WritingAccessMode } from "@/types/editor-permissions";
import type { ProjectWritingData } from "@/types/writing";

type ActiveDocumentDraft = {
  documentId: string;
  title: string;
  notes: string;
  status: ProjectWritingData["activeDocument"]["status"];
  targetWords: number | null;
};

function getActiveDocumentDraft(
  data: ProjectWritingData["activeDocument"],
): ActiveDocumentDraft {
  return {
    documentId: data.id,
    title: data.title,
    notes: data.notes ?? "",
    status: data.status,
    targetWords: data.targetWords,
  };
}

export function WritingShell({
  data,
  accessMode = "master",
}: {
  data: ProjectWritingData;
  accessMode?: WritingAccessMode;
}) {
  const { project, documentNodes, activeDocument } = data;
  const focusMode = useWritingStore((state) => state.focusMode);
  const activeWritingMode = useWritingStore((state) => state.activeWritingMode);
  const setProjectId = useWritingStore((state) => state.setProjectId);
  const setCurrentDocumentNodeId = useWritingStore(
    (state) => state.setCurrentDocumentNodeId,
  );
  const setStats = useWritingStore((state) => state.setStats);
  const setAccessMode = useWritingStore((state) => state.setAccessMode);

  const [draft, setDraft] = useState(() =>
    getActiveDocumentDraft(activeDocument),
  );

  const readOnly = accessMode === "viewer" || accessMode === "commenter";

  if (draft.documentId !== activeDocument.id) {
    setDraft(getActiveDocumentDraft(activeDocument));
  }

  const title = draft.title;
  const notes = draft.notes;
  const status = draft.status;
  const targetWords = draft.targetWords;
  const setTitle = (nextTitle: string) =>
    setDraft((current) => ({ ...current, title: nextTitle }));
  const setNotes = (nextNotes: string) =>
    setDraft((current) => ({ ...current, notes: nextNotes }));
  const setStatus = (nextStatus: typeof status) =>
    setDraft((current) => ({ ...current, status: nextStatus }));
  const setTargetWords = (nextTargetWords: number | null) =>
    setDraft((current) => ({ ...current, targetWords: nextTargetWords }));

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
      {!focusMode ? <WritingModeTabs /> : null}

      <div
        className={
          focusMode
            ? "grid min-h-[calc(100dvh-65px)] grid-cols-1"
            : activeWritingMode === "editor"
              ? "grid min-h-[calc(100dvh-122px)] grid-cols-1 lg:grid-cols-[17.5rem_minmax(0,1fr)] xl:grid-cols-[17.5rem_minmax(0,1fr)_20rem]"
              : "grid min-h-[calc(100dvh-122px)] grid-cols-1 lg:grid-cols-[17.5rem_minmax(0,1fr)]"
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
          {activeWritingMode === "editor" || focusMode ? (
            <>
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
            </>
          ) : null}
          {activeWritingMode === "binder" && !focusMode ? (
            <ProjectBinder
              project={project}
              nodes={documentNodes}
              activeNodeId={activeDocument.id}
            />
          ) : null}
          {activeWritingMode === "corkboard" && !focusMode ? (
            <CorkboardView project={project} nodes={documentNodes} />
          ) : null}
          {activeWritingMode === "outliner" && !focusMode ? (
            <OutlinerView project={project} nodes={documentNodes} />
          ) : null}
          {activeWritingMode === "scrivenings" && !focusMode ? (
            <ScriveningsView
              project={project}
              nodes={documentNodes}
              accessMode={accessMode}
            />
          ) : null}
          {activeWritingMode === "snapshots" && !focusMode ? (
            <SnapshotsPanel document={activeDocument} />
          ) : null}
          {activeWritingMode === "targets" && !focusMode ? (
            <WritingTargetsPanel
              project={project}
              activeDocument={activeDocument}
              nodes={documentNodes}
            />
          ) : null}
        </main>

        {!focusMode && activeWritingMode === "editor" ? (
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
