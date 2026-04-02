export type SitePath = "/" | "/evolution" | "/instruments" | "/ecosystem";

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Participation", href: "#participation" },
  { label: "Philosophy", href: "#concept" },
  { label: "How It Works", href: "#system" },
  { label: "Team", href: "#collaborators" },
  { label: "FAQ", href: "#faq" },
  { label: "Evolution", href: "/evolution" },
  { label: "Instruments", href: "/instruments" },
  { label: "Ecosystem", href: "/ecosystem" },
];

export function resolveNavHref(href: string, currentPath: SitePath) {
  if (href.startsWith("#") && currentPath !== "/") {
    return `/${href}`;
  }
  return href;
}

