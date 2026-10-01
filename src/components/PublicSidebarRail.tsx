import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import CurrencySelector from "./CurrencySelector";
import SimpleLanguageSelector from "./SimpleLanguageSelector";

export const OPEN_PUBLIC_SIDEBAR_EVENT = "open-public-sidebar";

export function openPublicSidebar() {
  window.dispatchEvent(new Event(OPEN_PUBLIC_SIDEBAR_EVENT));
}

const PublicSidebarRail = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_PUBLIC_SIDEBAR_EVENT, open);
    return () => window.removeEventListener(OPEN_PUBLIC_SIDEBAR_EVENT, open);
  }, []);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-[90] hidden w-24 flex-col items-center border-r border-navy-foreground/10 bg-navy text-navy-foreground lg:flex">
        <Link to="/" aria-label="Future Homes International – hem" className="flex h-28 w-full items-center justify-center border-b border-navy-foreground/10">
          <img src="/favicon-512x512.png" alt="Future Homes International" width={52} height={52} className="h-12 w-12 object-contain" />
        </Link>
        <div className="flex flex-1 flex-col items-center justify-center gap-12">
          <button type="button" aria-label="Open menu" onClick={() => setIsOpen(true)} className="group flex h-12 w-12 items-center justify-center border border-navy-foreground/20 transition-colors hover:border-gold hover:text-gold">
            <Menu size={21} aria-hidden="true" />
          </button>
          <span className="font-serif text-[10px] font-semibold uppercase text-navy-foreground/60 [letter-spacing:.22em] [writing-mode:vertical-rl]">Future Homes International</span>
        </div>
        <div className="flex w-full flex-col items-center gap-3 border-t border-navy-foreground/10 py-5">
          <SimpleLanguageSelector dark />
          <CurrencySelector dark />
        </div>
      </aside>
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default PublicSidebarRail;