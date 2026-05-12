"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  projectCreateSchema,
  type ProjectCreateInput,
} from "@/lib/validations/project-create";
import { mapProjectRow } from "@/features/projects/services/get-user-projects";
import type { ProjectStatus, UserProject } from "@/types/project";
import type { ProjectType } from "@/constants/project-types";

export type CreateProjectResult =
  | { status: "ok"; data: UserProject }
  | { status: "error"; message: string };

type CreatedProjectRow = {
  id: string;
  user_id: string;
  type: ProjectType;
  title: string;
  description: string | null;
  status: ProjectStatus;
  word_count: number;
  created_at: string;
  updated_at: string;
  last_opened_at: string | null;
};

export async function createProjectAction(
  input: ProjectCreateInput,
): Promise<CreateProjectResult> {
  const profile = await requireApprovedUser();
  const parsed = projectCreateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: profile.authUserId,
        type: parsed.data.type,
        title: parsed.data.title,
        description: parsed.data.description || null,
        status: "active",
        word_count: 0,
        last_opened_at: new Date().toISOString(),
      })
      .select(
        "id, user_id, type, title, description, status, word_count, created_at, updated_at, last_opened_at",
      )
      .single();

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath("/plataforma");

    return {
      status: "ok",
      data: mapProjectRow(data as CreatedProjectRow),
    };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Falha ao criar projeto.",
    };
  }
}
