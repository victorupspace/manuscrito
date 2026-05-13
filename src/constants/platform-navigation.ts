/**
 * Itens de navegação do dashboard.
 * `icon` é o nome do Material Symbols Outlined consumido por `<Icon>`.
 * Catálogo: https://fonts.google.com/icons
 */
type PlatformNavigationItem = {
  href: string;
  label: string;
  icon: string;
};

export const PLATFORM_NAVIGATION: PlatformNavigationItem[] = [
  { href: "/plataforma", label: "Início", icon: "home" },
  { href: "/plataforma/perfil", label: "Perfil", icon: "person" },
];

export const PLATFORM_SECONDARY_NAVIGATION: PlatformNavigationItem[] = [];
