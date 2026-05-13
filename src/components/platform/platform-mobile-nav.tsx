"use client";

import Link from "next/link";

import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { Icon } from "@/components/ui/icon";
import { PLATFORM_NAVIGATION } from "@/constants/platform-navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function PlatformMobileNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface-0/95 px-3 py-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {PLATFORM_NAVIGATION.slice(0, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[0.7rem] text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Icon name={item.icon} opticalSize={20} className="text-[20px]" />
            {item.label}
          </Link>
        ))}

        <Sheet>
          <SheetTrigger
            className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[0.7rem] text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label="Abrir menu"
          >
            <Icon name="menu" opticalSize={20} className="text-[20px]" />
            Menu
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="rounded-t-xl border-border-default bg-surface-1 px-4 pb-6 shadow-lg"
          >
            <SheetHeader className="px-0">
              <SheetTitle className="sr-only">Menu Manuscrito</SheetTitle>
              <BrandWordmark href="/plataforma" tone="brand" size="sm" />
            </SheetHeader>
            <nav className="grid grid-cols-2 gap-2" aria-label="Menu mobile">
              {PLATFORM_NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md border border-border-subtle bg-surface-2 px-3 py-3 text-[0.9rem] text-text-primary transition-colors hover:bg-surface-3"
                >
                  <Icon
                    name={item.icon}
                    opticalSize={20}
                    className="text-[20px] text-brand-primary"
                  />
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
