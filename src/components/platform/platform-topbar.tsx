import Link from "next/link";
import { UserRound } from "lucide-react";

import { NewProjectDialog } from "@/components/platform/new-project-dialog";
import type { ApprovedUserProfile } from "@/lib/auth/require-approved-user";

export function PlatformTopbar({ profile }: { profile: ApprovedUserProfile }) {
  const firstName = profile.fullName.split(/\s+/).filter(Boolean)[0] ?? "";

  return (
    <header className="sticky top-0 z-30 border-b border-brand-bordo/10 bg-brand-marfim/88 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-serif text-[0.68rem] uppercase tracking-[0.3em] text-brand-tinta/70">
            Início
          </p>
          <h1 className="truncate font-serif text-[1.25rem] italic text-brand-carvao sm:text-[1.45rem]">
            Olá{firstName ? `, ${firstName}` : ""}.
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/plataforma/perfil"
            className="inline-flex size-10 items-center justify-center rounded-full border border-brand-bordo/15 bg-brand-creme text-brand-bordo transition-colors hover:bg-brand-pergaminho focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none"
            aria-label="Abrir perfil"
          >
            <UserRound className="size-4" />
          </Link>
          <NewProjectDialog />
        </div>
      </div>
    </header>
  );
}
