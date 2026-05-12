"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-bordo/10 bg-brand-marfim/94 px-3 py-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {PLATFORM_NAVIGATION.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md font-serif text-[0.68rem] text-brand-tinta transition-colors hover:bg-brand-creme hover:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none"
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}

        <Sheet>
          <SheetTrigger
            className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md font-serif text-[0.68rem] text-brand-tinta transition-colors hover:bg-brand-creme hover:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none"
            aria-label="Abrir menu"
          >
            <Menu className="size-4" />
            Menu
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="rounded-t-xl border-brand-bordo/15 bg-brand-marfim px-4 pb-6"
          >
            <SheetHeader className="px-0">
              <SheetTitle className="font-serif text-[1.35rem] italic text-brand-bordo">
                Manuscrito
              </SheetTitle>
            </SheetHeader>
            <nav className="grid grid-cols-2 gap-2" aria-label="Menu mobile">
              {PLATFORM_NAVIGATION.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-md border border-brand-bordo/10 bg-brand-creme/70 px-3 py-3 font-serif text-[0.9rem] text-brand-carvao"
                  >
                    <Icon className="size-4 text-brand-bordo" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
