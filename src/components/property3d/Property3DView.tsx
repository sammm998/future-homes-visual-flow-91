import { lazy, Suspense, useMemo, useState } from "react";
import { Box, Camera, Shapes, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { normalizeBuildingSpec, type BuildingRoom } from "@/lib/building3d";
import { getOptimizedImageUrl } from "@/utils/imageOptimization";

const BuildingModel = lazy(() => import("./BuildingModel"));

/** Real scans (Matterport etc.) win; otherwise show the AI-reconstructed building. */
export function toEmbeddableTourUrl(url: string): string {
  const m = url.match(/my\.matterport\.com\/show\/?\?m=([\w-]+)/);
  return m ? `https://my.matterport.com/show/?m=${m[1]}&play=1` : url;
}

/** Starts downloading the 3D engine when the visitor shows intent. */
const prefetchModel = () => void import("./BuildingModel");

export default function Property3DView({ tourUrl, model3d, title }: { tourUrl?: string | null; model3d?: unknown; title: string }) {
  const [open, setOpen] = useState(false);
  const [room, setRoom] = useState<BuildingRoom | null>(null);
  const [photo, setPhoto] = useState(true);
  // Stored specs already carry resolved photo URLs, so no image list is needed.
  const spec = useMemo(() => (model3d ? normalizeBuildingSpec(model3d, []) : null), [model3d]);
  if (!tourUrl && !spec) return null;
  const hasPhotos = !!spec?.facades.length;

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} onPointerEnter={prefetchModel} onFocus={prefetchModel} className="gap-2">
        <Box className="h-4 w-4" />3D view
      </Button>
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setRoom(null); }}>
        <DialogContent className="max-w-6xl overflow-hidden p-0">
          <DialogTitle className="px-4 pt-4 text-base">{title} — 3D</DialogTitle>
          <div className="relative h-[75vh] w-full bg-[#cfdde8]">
            {open && (tourUrl ? (
              <iframe src={toEmbeddableTourUrl(tourUrl)} title={`${title} 3D tour`} className="h-full w-full border-0" allow="xr-spatial-tracking; fullscreen" allowFullScreen />
            ) : spec && (
              <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading 3D…</div>}>
                <BuildingModel spec={spec} photoFacades={photo} />
              </Suspense>
            ))}
            {spec && !tourUrl && hasPhotos && !room && (
              <div className="absolute left-3 top-3 flex overflow-hidden rounded-full bg-background/95 text-xs font-semibold shadow-lg">
                <button type="button" onClick={() => setPhoto(true)} aria-pressed={photo} className={`flex items-center gap-1.5 px-3 py-2 ${photo ? "bg-navy text-navy-foreground" : ""}`}>
                  <Camera className="h-3.5 w-3.5" />Photo facade
                </button>
                <button type="button" onClick={() => setPhoto(false)} aria-pressed={!photo} className={`flex items-center gap-1.5 px-3 py-2 ${!photo ? "bg-navy text-navy-foreground" : ""}`}>
                  <Shapes className="h-3.5 w-3.5" />Model
                </button>
              </div>
            )}
            {spec && !tourUrl && spec.rooms.length > 0 && !room && (
              <div className="absolute inset-x-0 bottom-0 flex gap-2 overflow-x-auto p-3">
                {spec.rooms.map((r, i) => (
                  <button key={i} type="button" onClick={() => setRoom(r)} className="flex shrink-0 items-center gap-2 rounded-full bg-background/95 py-1 pl-1 pr-3 text-xs font-semibold shadow-lg hover:bg-background">
                    <img src={getOptimizedImageUrl(r.image, 160, 70)} alt="" className="h-8 w-8 rounded-full object-cover" loading="lazy" decoding="async" />{r.label}
                  </button>
                ))}
              </div>
            )}
            {room && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/90 p-4">
                <img src={getOptimizedImageUrl(room.image, 1600, 82)} alt={room.label} className="max-h-full max-w-full rounded-md object-contain shadow-2xl" decoding="async" />
                <div className="absolute left-4 top-4 rounded-full bg-background px-3 py-1 text-sm font-semibold">{room.label}</div>
                <Button size="icon" variant="secondary" className="absolute right-4 top-4" onClick={() => setRoom(null)} aria-label="Back to building"><X className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
          {!tourUrl && (
            <p className="px-4 pb-4 text-xs text-muted-foreground">
              3D building reconstructed by AI from this listing's photos{hasPhotos ? ", with the real facade photos straightened onto the model" : ""}
              {spec?.rooms.length ? " — tap a label to view that room" : ""}. Drag to rotate, scroll to zoom. Indicative, not to scale.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
