import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { NewProjectDialog } from "@/components/platform/new-project-dialog";
import type { ApprovedUserProfile } from "@/lib/auth/require-approved-user";

export function PlatformTopbar({ profile }: { profile: ApprovedUserProfile }) {
  const firstName = profile.fullName.split(/\s+/).filter(Boolean)[0] ?? "";

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface-0/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-text-muted">
            Início
          </p>
          <h1 className="mt-0.5 truncate text-[1.05rem] font-bold text-text-primary lg:text-[1.2rem]">
            Olá{firstName ? `, ${firstName}` : ""}.
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/plataforma/perfil"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border-default bg-surface-2 text-brand-primary transition-colors hover:bg-surface-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label="Abrir perfil"
          >
            <Icon name="person" opticalSize={20} className="text-[18px]" />
          </Link>
          <NewProjectDialog />
        </div>
      </div>
    </header>
  );
}
