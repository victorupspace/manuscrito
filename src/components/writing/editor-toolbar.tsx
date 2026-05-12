"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  SeparatorHorizontal,
  Undo2,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function EditorToolbar({
  editor,
  compact = false,
}: {
  editor: Editor | null;
  compact?: boolean;
}) {
  if (!editor) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1 overflow-x-auto rounded-md border border-brand-bordo/10 bg-brand-creme/75 p-1 backdrop-blur",
        compact && "bg-transparent",
      )}
      aria-label="Barra de formatação"
    >
      <ToolbarButton
        label="Negrito"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={Bold}
      />
      <ToolbarButton
        label="Itálico"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={Italic}
      />
      <ToolbarButton
        label="Título"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        icon={Heading2}
      />
      <ToolbarButton
        label="Lista"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        icon={List}
      />
      <ToolbarButton
        label="Lista numerada"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        icon={ListOrdered}
      />
      <ToolbarButton
        label="Citação"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        icon={Quote}
      />
      <ToolbarButton
        label="Divisor"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={SeparatorHorizontal}
      />
      <ToolbarButton
        label="Link"
        active={editor.isActive("link")}
        onClick={() => {
          const previous = editor.getAttributes("link").href as
            | string
            | undefined;
          const href = window.prompt("Link", previous ?? "");
          if (href === null) return;
          if (!href) {
            editor.chain().focus().unsetLink().run();
            return;
          }
          editor.chain().focus().setLink({ href }).run();
        }}
        icon={LinkIcon}
      />
      <span className="mx-1 h-5 w-px bg-brand-bordo/10" />
      <ToolbarButton
        label="Desfazer"
        onClick={() => editor.chain().focus().undo().run()}
        icon={Undo2}
      />
      <ToolbarButton
        label="Refazer"
        onClick={() => editor.chain().focus().redo().run()}
        icon={Redo2}
      />
    </div>
  );
}

function ToolbarButton({
  label,
  icon: Icon,
  onClick,
  active,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={onClick}
            className={cn(
              "inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-brand-tinta transition-colors hover:bg-brand-marfim hover:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none",
              active &&
                "bg-brand-bordo text-brand-marfim hover:bg-brand-bordo hover:text-brand-marfim",
            )}
          />
        }
      >
        <Icon className="size-4" />
        <span className="sr-only">{label}</span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
