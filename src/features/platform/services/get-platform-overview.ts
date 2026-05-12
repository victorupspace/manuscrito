import "server-only";

import { PROJECT_TYPES, type ProjectType } from "@/constants/project-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PlatformOverview } from "@/types/platform";

type OverviewProjectRow = {
  type: ProjectType;
  status: string;
  word_count: number;
};

export type PlatformOverviewResult =
  | { status: "ok"; data: PlatformOverview }
  | { status: "error"; message: string };

export async function getPlatformOverview(
  userId: string,
): Promise<PlatformOverviewResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("type, status, word_count")
      .eq("user_id", userId);

    if (error) {
      return { status: "error", message: error.message };
    }

    const projectCounts = PROJECT_TYPES.reduce(
      (acc, type) => ({ ...acc, [type]: 0 }),
      {} as Record<ProjectType, number>,
    );

    let totalWords = 0;
    let activeMaterials = 0;

    for (const row of (data ?? []) as OverviewProjectRow[]) {
      totalWords += row.word_count ?? 0;
      projectCounts[row.type] += 1;
      if (row.status === "active" || row.status === "paused") {
        activeMaterials += 1;
      }
    }

    return {
      status: "ok",
      data: {
        totalWords,
        activeMaterials,
        projectCounts,
        writingStreakDays: 0,
      },
    };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao carregar visão geral.",
    };
  }
}
