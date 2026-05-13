import Link from "next/link";

import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { Icon } from "@/components/ui/icon";
import { logoutUserAction } from "@/features/auth/actions/logout-user";
import type { ApprovedUserProfile } from "@/lib/auth/require-approved-user";
import {
  PLATFORM_NAVIGATION,
  PLATFORM_SECONDARY_NAVIGATION,
} from "@/constants/platform-navigation";

export function PlatformSidebar({ profile }: { profile: ApprovedUserProfile }) {
  return (
    <aside className="sticky top-0 hidden h-dvh border-r border-border-subtle bg-surface-1 px-5 py-6 lg:flex lg:flex-col">
      <BrandWordmark href="/plataforma" tone="brand" size="sm" />

      <nav className="mt-10 space-y-0.5" aria-label="Navegação principal">
        {PLATFORM_NAVIGATION.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-[0.92rem] text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Icon
              name={item.icon}
              opticalSize={20}
              className="text-[20px] text-text-muted transition-colors group-hover:text-brand-primary"
            />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-md border border-border-subtle bg-surface-2 p-4 shadow-xs">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-text-muted">
            Conta
          </p>
          <p className="mt-2 truncate text-[0.95rem] font-bold text-text-primary">
            {profile.fullName}
          </p>
          <p className="mt-0.5 truncate text-[0.82rem] text-text-secondary">
            {profile.email}
          </p>
        </div>

        <nav className="space-y-0.5" aria-label="Navegação secundária">
          {PLATFORM_SECONDARY_NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-[0.88rem] text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Icon
                name={item.icon}
                opticalSize={20}
                className="text-[20px]"
              />
              {item.label}
            </Link>
          ))}
          <form action={logoutUserAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[0.88rem] text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Icon name="logout" opticalSize={20} className="text-[20px]" />
              Sair
            </button>
          </form>
        </nav>
      </div>
    </aside>
  );
}
