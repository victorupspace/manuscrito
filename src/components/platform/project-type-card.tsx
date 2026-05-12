"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import type { ProjectType } from "@/constants/project-types";
import { cn } from "@/lib/utils";

type ProjectTypeCardProps = {
  type: ProjectType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  selected: boolean;
  onSelect: (type: ProjectType) => void;
};

export function ProjectTypeCard({
  type,
  label,
  description,
  icon: Icon,
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
        "group relative flex w-full gap-4 rounded-md border bg-brand-marfim p-4 text-left transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand-bordo/35",
        selected
          ? "border-brand-bordo/45 bg-brand-creme"
          : "border-brand-bordo/12 hover:border-brand-bordo/35 hover:bg-brand-creme/70",
      )}
      aria-pressed={selected}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-brand-bordo/15 bg-brand-marfim text-brand-bordo">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-[1.05rem] italic text-brand-carvao">
          {label}
        </span>
        <span className="mt-1 block font-serif text-[0.86rem] leading-relaxed text-brand-tinta">
          {description}
        </span>
      </span>
      {selected ? (
        <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-brand-bordo text-brand-marfim">
          <Check className="size-3" />
        </span>
      ) : null}
    </motion.button>
  );
}
