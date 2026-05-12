import Link from "next/link";
import { LogOut } from "lucide-react";

import { logoutUserAction } from "@/features/auth/actions/logout-user";
import type { ApprovedUserProfile } from "@/lib/auth/require-approved-user";
import {
  PLATFORM_NAVIGATION,
  PLATFORM_SECONDARY_NAVIGATION,
} from "@/constants/platform-navigation";

export function PlatformSidebar({ profile }: { profile: ApprovedUserProfile }) {
  return (
    <aside className="sticky top-0 hidden h-dvh border-r border-brand-bordo/10 bg-brand-creme/55 px-5 py-6 lg:flex lg:flex-col">
      <Link href="/plataforma" className="group block">
        <span className="font-serif text-[1.65rem] italic leading-none text-brand-carvao transition-colors group-hover:text-brand-bordo">
          Manuscrito
        </span>
        <span className="mt-1 block font-serif text-[0.62rem] uppercase tracking-[0.32em] text-brand-tinta">
          Estúdio de escrita
        </span>
      </Link>

      <nav className="mt-10 space-y-1" aria-label="Navegação principal">
        {PLATFORM_NAVIGATION.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-md px-3 py-2.5 font-serif text-[0.95rem] text-brand-tinta transition-colors hover:bg-brand-marfim hover:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none"
            >
              <Icon className="size-4 text-brand-bordo/65 transition-colors group-hover:text-brand-bordo" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-md border border-brand-bordo/10 bg-brand-marfim/70 p-4">
          <p className="font-serif text-[0.7rem] uppercase tracking-[0.26em] text-brand-tinta/70">
            Conta
          </p>
          <p className="mt-2 truncate font-serif text-[0.98rem] text-brand-carvao">
            {profile.fullName}
          </p>
          <p className="mt-0.5 truncate font-serif text-[0.8rem] text-brand-tinta">
            {profile.email}
          </p>
        </div>

        <nav className="space-y-1" aria-label="Navegação secundária">
          {PLATFORM_SECONDARY_NAVIGATION.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 font-serif text-[0.9rem] text-brand-tinta transition-colors hover:bg-brand-marfim hover:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none"
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <form action={logoutUserAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 font-serif text-[0.9rem] text-brand-tinta transition-colors hover:bg-brand-marfim hover:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </form>
        </nav>
      </div>
    </aside>
  );
}
