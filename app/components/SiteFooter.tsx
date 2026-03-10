import Image from "next/image";
import { NAV_ITEMS, resolveNavHref, type SitePath } from "./siteNavigation";

type SiteFooterProps = {
  currentPath?: SitePath;
  withMobileSpacer?: boolean;
};

export default function SiteFooter({
  currentPath = "/",
  withMobileSpacer = false,
}: SiteFooterProps) {
  return (
    <footer className="bg-white px-4 md:px-8 lg:px-24 py-10 border-t border-black/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center">
          <Image src="/assets/logo.png" alt="iRWA" width={100} height={56} className="object-contain" style={{ maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)" }} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-black/60">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={resolveNavHref(item.href, currentPath)}
              className="inline-flex min-h-10 items-center hover:text-black transition"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {withMobileSpacer ? <div className="md:hidden h-24" /> : null}
    </footer>
  );
}
