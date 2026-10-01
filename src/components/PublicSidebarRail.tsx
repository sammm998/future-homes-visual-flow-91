import { lazy, Suspense, useEffect, useState } from "react";

const Sidebar = lazy(() => import("./Sidebar"));

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

  if (!isOpen) return null;

  return (
    <Suspense fallback={null}>
      <Sidebar isOpen onClose={() => setIsOpen(false)} />
    </Suspense>
  );
};

export default PublicSidebarRail;