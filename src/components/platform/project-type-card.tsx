"use client";

import { motion } from "framer-motion";

import { Icon } from "@/components/ui/icon";
import type { ProjectType } from "@/constants/project-types";
import { cn } from "@/lib/utils";

type ProjectTypeCardProps = {
  type: ProjectType;
  label: string;
  description: string;
  /** Nome do Material Symbols Outlined (ex.: "menu_book"). */
  icon: string;
  selected: boolean;
  onSelect: (type: ProjectType) => void;
};

export function ProjectTypeCard({
  type,
  label,
  description,
  icon,
  selected,
  onSelect,
}: ProjectTypeCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(type)}
      className={cn(
        "group relative flex w-full gap-4 rounded-md border p-4 text-left transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-brand-primary bg-brand-primary-soft"
          : "border-border-subtle bg-surface-2 hover:border-border-default hover:bg-surface-3",
      )}
      aria-pressed={selected}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-brand-primary-soft text-brand-primary">
        <Icon name={icon} opticalSize={24} className="text-[24px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[1rem] font-bold tracking-tight text-text-primary">
          {label}
        </span>
        <span className="mt-1 block text-[0.86rem] leading-relaxed text-text-secondary">
          {description}
        </span>
      </span>
      {selected ? (
        <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-brand-primary text-text-on-brand">
          <Icon name="check" opticalSize={20} className="text-[14px]" />
        </span>
      ) : null}
    </motion.button>
  );
}
