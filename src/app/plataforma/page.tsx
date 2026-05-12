import { MaterialsSection } from "@/components/platform/materials-section";
import { OverviewMetrics } from "@/components/platform/overview-metrics";
import { PlatformShell } from "@/components/platform/platform-shell";
import { WelcomePanel } from "@/components/platform/welcome-panel";
import { WritingInsights } from "@/components/platform/writing-insights";
import { WritingTasksCard } from "@/components/platform/writing-tasks-card";
import { PROJECT_TYPES } from "@/constants/project-types";
import { getPlatformOverview } from "@/features/platform/services/get-platform-overview";
import { getUserProjects } from "@/features/projects/services/get-user-projects";
import { getUserTasks } from "@/features/tasks/services/get-user-tasks";
import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import type { PlatformOverview } from "@/types/platform";

export const metadata = {
  title: "Plataforma — Manuscrito",
};

export const dynamic = "force-dynamic";

const emptyOverview: PlatformOverview = {
  totalWords: 0,
  activeMaterials: 0,
  projectCounts: PROJECT_TYPES.reduce(
    (acc, type) => ({ ...acc, [type]: 0 }),
    {} as PlatformOverview["projectCounts"],
  ),
  writingStreakDays: 0,
};

export default async function PlataformaPage() {
  const profile = await requireApprovedUser();
  const firstName = profile.fullName.split(/\s+/).filter(Boolean)[0] ?? "";

  const [overviewResult, projectsResult, tasksResult] = await Promise.all([
    getPlatformOverview(profile.authUserId),
    getUserProjects(profile.authUserId),
    getUserTasks(profile.authUserId),
  ]);

  const overview =
    overviewResult.status === "ok" ? overviewResult.data : emptyOverview;
  const projects = projectsResult.status === "ok" ? projectsResult.data : [];
  const tasks = tasksResult.status === "ok" ? tasksResult.data : [];

  return (
    <PlatformShell profile={profile}>
      <div className="space-y-8 py-5 sm:py-6">
        <WelcomePanel firstName={firstName} />

        <OverviewMetrics
          overview={overview}
          error={
            overviewResult.status === "error"
              ? overviewResult.message
              : undefined
          }
        />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <div className="space-y-8">
            <MaterialsSection
              projects={projects}
              error={
                projectsResult.status === "error"
                  ? projectsResult.message
                  : undefined
              }
            />
            <WritingInsights />
          </div>

          <aside className="space-y-5">
            <WritingTasksCard
              initialTasks={tasks}
              error={
                tasksResult.status === "error" ? tasksResult.message : undefined
              }
            />
          </aside>
        </div>
      </div>
    </PlatformShell>
  );
}
