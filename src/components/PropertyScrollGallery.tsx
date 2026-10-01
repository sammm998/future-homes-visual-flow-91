import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { OptimizedPropertyImage } from "@/components/OptimizedPropertyImage";

interface Props {
  images: string[];
  title: string;
  location?: string;
  startIndex?: number;
  onClose: () => void;
}

/** Light, vertically scrolling photo view — every photo stacked, like Hemnet. */
const PropertyScrollGallery = ({ images, title, location, startIndex = 0, onClose }: Props) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => refs.current[startIndex]?.scrollIntoView({ block: "start" }));
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [startIndex, onClose]);

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-background" role="dialog" aria-modal="true" aria-label={title}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy">{title}</p>
          <p className="text-xs text-muted-foreground">{images.length} photos{location ? ` · ${location}` : ""}</p>
        </div>
        <button onClick={onClose} aria-label="Close" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-navy transition hover:bg-ivory">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mx-auto max-w-5xl space-y-3 px-3 py-6 sm:space-y-4 sm:px-6">
        {images.map((src, i) => (
          <div key={i} ref={(el) => { refs.current[i] = el; }} className="scroll-mt-20 overflow-hidden rounded-sm bg-muted">
            <OptimizedPropertyImage src={src} alt={`${title} — photo ${i + 1}`} className="h-auto w-full object-cover" priority={Math.abs(i - startIndex) < 2} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyScrollGallery;
