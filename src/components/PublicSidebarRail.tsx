import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

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
    <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
  );
};

export default PublicSidebarRail;