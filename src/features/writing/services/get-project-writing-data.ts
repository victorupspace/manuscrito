import "server-only";

import { notFound } from "next/navigation";

import type { DocumentNodeType } from "@/constants/document-node-types";
import type { ProjectType } from "@/constants/project-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProjectStatus } from "@/types/project";
import type {
  DocumentStatus,
  ProjectWritingData,
  WritingDocumentNode,
  WritingProject,
} from "@/types/writing";

type ProjectRow = {
  id: string;
  user_id: string;
  type: ProjectType;
  title: string;
  description: string | null;
  status: ProjectStatus;
  word_count: number;
  target_words: number | null;
  created_at: string;
  updated_at: string;
  last_opened_at: string | null;
};

export type DocumentNodeRow = {
  id: string;
  project_id: string;
  user_id: string;
  parent_id: string | null;
  type: DocumentNodeType;
  title: string;
  content_json: unknown | null;
  content_html: string | null;
  plain_text: string | null;
  synopsis: string | null;
  summary: string | null;
  order_index: number;
  status: DocumentStatus;
  word_count: number;
  character_count: number;
  reading_time: number;
  target_words: number | null;
  notes: string | null;
  pov: string | null;
  location: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  last_saved_at: string | null;
  last_synced_at: string | null;
};

export function mapProject(row: ProjectRow): WritingProject {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    description: row.description,
    status: row.status,
    wordCount: row.word_count,
    targetWords: row.target_words,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastOpenedAt: row.last_opened_at,
  };
}

export function mapDocumentNode(row: DocumentNodeRow): WritingDocumentNode {
  return {
    id: row.id,
    projectId: row.project_id,
    userId: row.user_id,
    parentId: row.parent_id,
    type: row.type,
    title: row.title,
    contentJson: row.content_json,
    contentHtml: row.content_html,
    plainText: row.plain_text,
    synopsis: row.synopsis,
    summary: row.summary,
    orderIndex: row.order_index,
    status: row.status,
    wordCount: row.word_count,
    characterCount: row.character_count,
    readingTime: row.reading_time,
    targetWords: row.target_words,
    notes: row.notes,
    pov: row.pov,
    location: row.location,
    tags: row.tags ?? [],
    metadata: row.metadata ?? {},
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastSavedAt: row.last_saved_at,
    lastSyncedAt: row.last_synced_at,
  };
}

function getDefaultDocumentType(projectType: ProjectType): DocumentNodeType {
  if (projectType === "book") return "chapter";
  if (projectType === "short_story") return "short_story_main";
  return "draft";
}

function getDefaultDocumentTitle(projectType: ProjectType): string {
  if (projectType === "book") return "Capítulo 1";
  if (projectType === "short_story") return "Texto principal";
  return "Rascunho inicial";
}

export async function getProjectWritingData({
  projectId,
  userId,
  requestedDocumentNodeId,
}: {
  projectId: string;
  userId: string;
  requestedDocumentNodeId?: string;
}): Promise<ProjectWritingData> {
  const supabase = await createSupabaseServerClient();

  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select(
      "id, user_id, type, title, description, status, word_count, target_words, created_at, updated_at, last_opened_at",
    )
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (projectError) {
    throw new Error(projectError.message);
  }

  if (!projectData) {
    notFound();
  }

  const project = mapProject(projectData as ProjectRow);

  const { data: nodesData, error: nodesError } = await supabase
    .from("document_nodes")
    .select(
      "id, project_id, user_id, parent_id, type, title, content_json, content_html, plain_text, synopsis, summary, order_index, status, word_count, character_count, reading_time, target_words, notes, pov, location, tags, metadata, archived_at, created_at, updated_at, last_saved_at, last_synced_at",
    )
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (nodesError) {
    throw new Error(nodesError.message);
  }

  let documentNodes = (nodesData ?? []).map((row) =>
    mapDocumentNode(row as DocumentNodeRow),
  );

  if (documentNodes.length === 0) {
    const { data: created, error: createError } = await supabase
      .from("document_nodes")
      .insert({
        project_id: projectId,
        user_id: userId,
        type: getDefaultDocumentType(project.type),
        title: getDefaultDocumentTitle(project.type),
        order_index: 0,
        status: "draft",
      })
      .select(
        "id, project_id, user_id, parent_id, type, title, content_json, content_html, plain_text, synopsis, summary, order_index, status, word_count, character_count, reading_time, target_words, notes, pov, location, tags, metadata, archived_at, created_at, updated_at, last_saved_at, last_synced_at",
      )
      .single();

    if (createError) {
      throw new Error(createError.message);
    }

    documentNodes = [mapDocumentNode(created as DocumentNodeRow)];
  }

  const activeDocument =
    documentNodes.find((node) => node.id === requestedDocumentNodeId) ??
    documentNodes[0];

  await supabase
    .from("projects")
    .update({ last_opened_at: new Date().toISOString() })
    .eq("id", projectId)
    .eq("user_id", userId);

  return {
    project,
    documentNodes,
    activeDocument,
  };
}
