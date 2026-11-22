import { lazy, Suspense, useState } from "react";
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const ApartmentModel = lazy(() => import("./ApartmentModel"));

/** Real scans (Matterport etc.) win; otherwise show the generated model built from the listing. */
export function toEmbeddableTourUrl(url: string): string {
  const m = url.match(/my\.matterport\.com\/show\/?\?m=([\w-]+)/);
  return m ? `https://my.matterport.com/show/?m=${m[1]}&play=1` : url;
}

export default function Property3DView({ tourUrl, bedrooms, images, title }: { tourUrl?: string | null; bedrooms?: number | string | null; images: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const beds = parseInt(String(bedrooms ?? "1"), 10) || 1;
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2"><Box className="h-4 w-4" />3D view</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden">
          <DialogTitle className="px-4 pt-4 text-base">{title} — 3D</DialogTitle>
          <div className="h-[75vh] w-full bg-primary">
            {open && (tourUrl ? (
              <iframe src={toEmbeddableTourUrl(tourUrl)} title={`${title} 3D tour`} className="h-full w-full border-0" allow="xr-spatial-tracking; fullscreen" allowFullScreen />
            ) : (
              <Suspense fallback={<div className="flex h-full items-center justify-center text-primary-foreground">Loading 3D…</div>}>
                <ApartmentModel bedrooms={beds} images={images} />
              </Suspense>
            ))}
          </div>
          {!tourUrl && <p className="px-4 pb-4 text-xs text-muted-foreground">Illustrative 3D layout built from this listing's photos. Drag to rotate, scroll to zoom.</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}
