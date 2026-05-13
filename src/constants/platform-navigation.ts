/**
 * Itens de navegação do dashboard.
 * `icon` é o nome do Material Symbols Outlined consumido por `<Icon>`.
 * Catálogo: https://fonts.google.com/icons
 */
export const PLATFORM_NAVIGATION = [
  { href: "/plataforma", label: "Início", icon: "home" },
  { href: "/plataforma/textos", label: "Meus textos", icon: "library_books" },
  { href: "/plataforma/livros", label: "Livros", icon: "menu_book" },
  { href: "/plataforma/contos", label: "Contos", icon: "edit_note" },
  { href: "/plataforma/rascunhos", label: "Rascunhos", icon: "draft" },
  { href: "/plataforma/tarefas", label: "Tarefas", icon: "checklist" },
  { href: "/plataforma/perfil", label: "Perfil", icon: "person" },
] as const;

export const PLATFORM_SECONDARY_NAVIGATION = [
  {
    href: "/plataforma/perfil",
    label: "Configurações",
    icon: "settings",
  },
] as const;
