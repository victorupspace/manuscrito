"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/backoffice", label: "Painel", exact: true },
  { href: "/backoffice/requests", label: "Solicitações", exact: false },
  { href: "/backoffice/customers", label: "Clientes", exact: false },
  { href: "/backoffice/editors", label: "Editores", exact: false },
  { href: "/backoffice/subscriptions", label: "Assinaturas", exact: false },
] as const;

export function BackofficeNav({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "compact";
}) {
  const pathname = usePathname() ?? "";

  return (
    <nav className={className}>
      <ul
        className={cn(
          "flex items-center gap-1",
          variant === "compact"
            ? "mx-auto w-full max-w-6xl flex-wrap px-6 pb-3"
            : "",
        )}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "rounded-sm px-3 py-1.5 font-serif transition-colors",
                  variant === "compact"
                    ? "text-[0.85rem]"
                    : "text-[0.92rem]",
                  isActive
                    ? "bg-brand-bordo/10 text-brand-bordo"
                    : "text-brand-grafite hover:bg-brand-bordo/5 hover:text-brand-bordo",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
