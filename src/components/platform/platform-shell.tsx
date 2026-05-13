import type { ApprovedUserProfile } from "@/lib/auth/require-approved-user";
import { PlatformMobileNav } from "@/components/platform/platform-mobile-nav";
import { PlatformSidebar } from "@/components/platform/platform-sidebar";
import { PlatformTopbar } from "@/components/platform/platform-topbar";

export function PlatformShell({
  profile,
  children,
}: {
  profile: ApprovedUserProfile;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface-0 text-text-primary">
      <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-[18rem_1fr]">
        <PlatformSidebar profile={profile} />
        <div className="min-w-0 pb-24 lg:pb-0">
          <PlatformTopbar profile={profile} />
          <main className="px-4 pb-10 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
      <PlatformMobileNav />
    </div>
  );
}
