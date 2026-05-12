"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ProjectOutlineSidebar } from "@/components/writing/project-outline-sidebar";
import { WritingContextPanel } from "@/components/writing/writing-context-panel";
import { useWritingStore } from "@/stores/writing-store";
import type { WritingDocumentNode, WritingProject } from "@/types/writing";

export function MobileWritingNavigation({
  project,
  nodes,
  activeDocument,
  notes,
  status,
  targetWords,
  onNotesChange,
  onStatusChange,
  onTargetWordsChange,
  readOnly,
}: {
  project: WritingProject;
  nodes: WritingDocumentNode[];
  activeDocument: WritingDocumentNode;
  notes: string;
  status: WritingDocumentNode["status"];
  targetWords: number | null;
  onNotesChange: (notes: string) => void;
  onStatusChange: (status: WritingDocumentNode["status"]) => void;
  onTargetWordsChange: (targetWords: number | null) => void;
  readOnly?: boolean;
}) {
  const outlineOpen = useWritingStore((state) => state.outlineOpen);
  const setOutlineOpen = useWritingStore((state) => state.setOutlineOpen);
  const contextOpen = useWritingStore((state) => state.contextPanelOpen);
  const setContextOpen = useWritingStore((state) => state.setContextPanelOpen);

  return (
    <>
      <Sheet open={outlineOpen} onOpenChange={setOutlineOpen}>
        <SheetContent
          side="left"
          className="w-[86vw] max-w-sm bg-brand-creme p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Estrutura</SheetTitle>
          </SheetHeader>
          <ProjectOutlineSidebar
            project={project}
            nodes={nodes}
            activeNodeId={activeDocument.id}
          />
        </SheetContent>
      </Sheet>
      <Sheet open={contextOpen} onOpenChange={setContextOpen}>
        <SheetContent
          side="right"
          className="w-[88vw] max-w-sm bg-brand-creme p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Notas e contexto</SheetTitle>
          </SheetHeader>
          <WritingContextPanel
            document={activeDocument}
            notes={notes}
            status={status}
            targetWords={targetWords}
            onNotesChange={onNotesChange}
            onStatusChange={onStatusChange}
            onTargetWordsChange={onTargetWordsChange}
            readOnly={readOnly}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
