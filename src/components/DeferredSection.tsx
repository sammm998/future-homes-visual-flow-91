import React, { Suspense, useEffect, useRef, useState } from "react";

interface DeferredSectionProps {
  children: React.ReactNode;
  /** Placeholder height reserved before the section mounts (avoids layout shift). */
  minHeight?: number;
  className?: string;
  rootMargin?: string;
}

/**
 * Mounts (and downloads) its children only when the section is close to the
 * viewport. Keeps below-the-fold JS off the critical path, which cuts
 * Total Blocking Time and speeds up LCP.
 */
const DeferredSection: React.FC<DeferredSectionProps> = ({
  children,
  minHeight = 400,
  className,
  rootMargin = "200px",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);

    return () => {
      io.disconnect();
    };
  }, [show, rootMargin]);

  return (
    <div ref={ref} className={className} style={show
      ? { contentVisibility: 'auto', containIntrinsicSize: `auto ${minHeight}px` }
      : { minHeight }}>
      {show ? <Suspense fallback={<div style={{ minHeight }} />}>{children}</Suspense> : null}
    </div>
  );
};

export default DeferredSection;
