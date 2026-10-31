import { useEffect, useRef, useState } from "react";

/** Media plays only while its section is on screen and the tab is active. */
export function useMediaVisibility<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let intersects = false;
    const update = () => {
      const active = intersects && document.visibilityState !== "hidden";
      setVisible(active);
      if (active) setHasEntered(true);
    };
    const observer = new IntersectionObserver(([entry]) => {
      intersects = entry?.isIntersecting ?? false;
      update();
    }, { threshold: 0.05 });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return { ref, visible, hasEntered };
}