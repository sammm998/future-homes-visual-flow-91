import { Images } from "lucide-react";
import { OptimizedPropertyImage } from "@/components/OptimizedPropertyImage";
import { cc } from "@/utils/conversionCopy";

interface Props {
  images: string[];
  alt: string;
  lang: string;
  onOpen: (index: number) => void;
}

/** Large full-width mosaic: one big photo + up to four tiles; swipeable strip on mobile. */
export function PropertyHeroGallery({ images, alt, lang, onOpen }: Props) {
  const list = images.length ? images : ["/placeholder.svg"];
  const side = list.slice(1, 5);

  return (
    <div className="relative">
      {/* Mobile: swipe through every photo */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 md:hidden [scrollbar-width:none]">
        {list.map((src, i) => (
          <button key={i} type="button" onClick={() => onOpen(i)} aria-label={`${alt} — photo ${i + 1}`}
            className="relative aspect-[4/3] w-[88%] shrink-0 snap-center overflow-hidden rounded-xl">
            <OptimizedPropertyImage src={src} alt={`${alt} — photo ${i + 1}`} className="h-full w-full object-cover" priority={i === 0} />
            <span className="absolute bottom-2 right-2 rounded-full bg-background/85 px-2 py-0.5 text-xs font-medium text-foreground">
              {i + 1}/{list.length}
            </span>
          </button>
        ))}
      </div>

      {/* Desktop: mosaic */}
      <div className={`hidden h-[62vh] min-h-[420px] max-h-[680px] gap-2 md:grid ${side.length ? "grid-cols-4 grid-rows-2" : "grid-cols-1"}`}>
        <button type="button" onClick={() => onOpen(0)} aria-label={`${alt} — photo 1`}
          className={`group relative overflow-hidden rounded-l-2xl ${side.length ? "col-span-2 row-span-2" : "rounded-2xl"}`}>
          <OptimizedPropertyImage src={list[0]} alt={alt} className="h-full w-full object-cover animate-kenburns" priority />
        </button>
        {side.map((src, i) => (
          <button key={i} type="button" onClick={() => onOpen(i + 1)} aria-label={`${alt} — photo ${i + 2}`}
            className={`group relative overflow-hidden ${i === 1 ? "rounded-tr-2xl" : ""} ${i === 3 || (side.length < 4 && i === side.length - 1) ? "rounded-br-2xl" : ""} ${side.length < 3 ? "col-span-2" : ""}`}>
            <OptimizedPropertyImage src={src} alt={`${alt} — photo ${i + 2}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" priority={false} />
          </button>
        ))}
      </div>

      {list.length > 1 && (
        <button type="button" onClick={() => onOpen(0)}
          className="absolute bottom-4 right-4 hidden items-center gap-2 rounded-full bg-background/95 px-4 py-2 text-sm font-semibold text-foreground shadow-lg transition hover:bg-background md:flex">
          <Images className="h-4 w-4" aria-hidden="true" />
          {cc("view_all_photos", lang)} ({list.length})
        </button>
      )}
    </div>
  );
}
