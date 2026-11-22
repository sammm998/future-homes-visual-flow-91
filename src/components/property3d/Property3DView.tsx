import { lazy, Suspense, useState } from "react";
import { Box, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { normalizeBuildingSpec, type BuildingRoom } from "@/lib/building3d";

const BuildingModel = lazy(() => import("./BuildingModel"));

/** Real scans (Matterport etc.) win; otherwise show the AI-reconstructed building. */
export function toEmbeddableTourUrl(url: string): string {
  const m = url.match(/my\.matterport\.com\/show\/?\?m=([\w-]+)/);
  return m ? `https://my.matterport.com/show/?m=${m[1]}&play=1` : url;
}

export default function Property3DView({ tourUrl, model3d, title }: { tourUrl?: string | null; model3d?: unknown; title: string }) {
  const [open, setOpen] = useState(false);
  const [room, setRoom] = useState<BuildingRoom | null>(null);
  if (!tourUrl && !model3d) return null;
  const spec = model3d ? normalizeBuildingSpec(model3d, []) : null;
  if (spec && model3d && Array.isArray((model3d as any).rooms)) spec.rooms = (model3d as any).rooms.filter((r: any) => typeof r?.image === "string");
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2"><Box className="h-4 w-4" />3D view</Button>
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setRoom(null); }}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden">
          <DialogTitle className="px-4 pt-4 text-base">{title} — 3D</DialogTitle>
          <div className="relative h-[75vh] w-full bg-muted">
            {open && (tourUrl ? (
              <iframe src={toEmbeddableTourUrl(tourUrl)} title={`${title} 3D tour`} className="h-full w-full border-0" allow="xr-spatial-tracking; fullscreen" allowFullScreen />
            ) : spec && (
              <Suspense fallback={<div className="flex h-full items-center justify-center text-muted-foreground">Loading 3D…</div>}>
                <BuildingModel spec={spec} />
              </Suspense>
            ))}
            {spec && !tourUrl && spec.rooms.length > 0 && !room && (
              <div className="absolute inset-x-0 bottom-0 flex gap-2 overflow-x-auto p-3">
                {spec.rooms.map((r, i) => (
                  <button key={i} onClick={() => setRoom(r)} className="flex shrink-0 items-center gap-2 rounded-full bg-background/95 py-1 pl-1 pr-3 text-xs font-semibold shadow-lg hover:bg-background">
                    <img src={r.image} alt="" className="h-8 w-8 rounded-full object-cover" loading="lazy" />{r.label}
                  </button>
                ))}
              </div>
            )}
            {room && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/90 p-4">
                <img src={room.image} alt={room.label} className="max-h-full max-w-full rounded-md object-contain shadow-2xl" />
                <div className="absolute left-4 top-4 rounded-full bg-background px-3 py-1 text-sm font-semibold">{room.label}</div>
                <Button size="icon" variant="secondary" className="absolute right-4 top-4" onClick={() => setRoom(null)} aria-label="Back to building"><X className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
          {!tourUrl && <p className="px-4 pb-4 text-xs text-muted-foreground">3D building reconstructed by AI from this listing's photos{spec?.rooms.length ? " — tap a label to view that room" : ""}. Drag to rotate, scroll to zoom.</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}
