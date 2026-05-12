import { WritingErrorState } from "@/components/writing/writing-error-state";
import { WritingShell } from "@/components/writing/writing-shell";
import { getProjectWritingData } from "@/features/writing/services/get-project-writing-data";
import { requireApprovedUser } from "@/lib/auth/require-approved-user";

export const metadata = {
  title: "Escrita — Manuscrito",
};

export const dynamic = "force-dynamic";

export default async function WritingProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ node?: string }>;
}) {
  const profile = await requireApprovedUser();
  const { projectId } = await params;
  const { node } = await searchParams;

  let data;
  try {
    data = await getProjectWritingData({
      projectId,
      userId: profile.authUserId,
      requestedDocumentNodeId: node,
    });
  } catch (err) {
    return (
      <WritingErrorState
        message={
          err instanceof Error
            ? err.message
            : "Verifique sua conexão e tente novamente."
        }
      />
    );
  }

  return <WritingShell data={data} accessMode="master" />;
}
