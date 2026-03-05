export type SitePath = "/" | "/evolution" | "/instruments";

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Philosophy", href: "#concept" },
  { label: "Our Projects", href: "#projects" },
  { label: "How It Works", href: "#system" },
  { label: "Participation", href: "#participation" },
  { label: "FAQ", href: "#faq" },
  { label: "Evolution", href: "/evolution" },
  { label: "Instruments", href: "/instruments" },
];

export function resolveNavHref(href: string, currentPath: SitePath) {
  if (href.startsWith("#") && currentPath !== "/") {
    return `/${href}`;
  }
  return href;
}

