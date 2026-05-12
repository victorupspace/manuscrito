import {
  BookOpen,
  Feather,
  FileText,
  Home,
  LibraryBig,
  ListChecks,
  Settings,
  UserRound,
} from "lucide-react";

export const PLATFORM_NAVIGATION = [
  { href: "/plataforma", label: "Início", icon: Home },
  { href: "/plataforma/textos", label: "Meus textos", icon: LibraryBig },
  { href: "/plataforma/livros", label: "Livros", icon: BookOpen },
  { href: "/plataforma/contos", label: "Contos", icon: Feather },
  { href: "/plataforma/rascunhos", label: "Rascunhos", icon: FileText },
  { href: "/plataforma/tarefas", label: "Tarefas", icon: ListChecks },
  { href: "/plataforma/perfil", label: "Perfil", icon: UserRound },
] as const;

export const PLATFORM_SECONDARY_NAVIGATION = [
  { href: "/plataforma/perfil", label: "Configurações", icon: Settings },
] as const;
