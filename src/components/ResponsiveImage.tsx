import type { ImgHTMLAttributes } from "react";
import { preload } from "react-dom";
import { avifSrcSetFor } from "@/lib/destinationImages";

type ResponsiveImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  /** Layout width hint for choosing the AVIF candidate. */
  sizes?: string;
  /** Above-the-fold hero: emit an early high-priority preload in <head>. */
  priority?: boolean;
};

/**
 * <img> that serves a small AVIF candidate when the source has generated
 * variants (destination photos), falling back to the original file.
 */
export default function ResponsiveImage({ src, sizes = "100vw", alt = "", priority = false, ...rest }: ResponsiveImageProps) {
  const avif = avifSrcSetFor(src);
  // React does not preload images inside <picture>, so the hero would queue
  // behind the script preloads; this puts the AVIF request first in <head>.
  if (priority && avif) {
    preload(src, { as: "image", imageSrcSet: avif, imageSizes: sizes, type: "image/avif", fetchPriority: "high" });
  }
  if (priority) rest = { fetchPriority: "high", ...rest };
  if (!avif) return <img src={src} alt={alt} sizes={rest.srcSet ? sizes : undefined} {...rest} />;
  return (
    <picture>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <img src={src} alt={alt} {...rest} />
    </picture>
  );
}
