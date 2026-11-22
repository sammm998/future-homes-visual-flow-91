import { useRef, useState } from "react";
import { Box, Loader2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { generateNextBuilding3d } from "@/lib/building3d.functions";

/**
 * Builds the AI 3D model for every active home that lacks one, one home per
 * request so each call stays short. Failures are skipped and listed.
 */
export default function AdminBuilding3dGenerator() {
  const [running, setRunning] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [failed, setFailed] = useState<{ ref: string; error: string }[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const stop = useRef(false);

  const run = async () => {
    stop.current = false;
    setRunning(true);
    setDone([]);
    setFailed([]);
    const skip: string[] = [];
    try {
      while (!stop.current) {
        const r = await generateNextBuilding3d({ data: { upgrade, skip } });
        setRemaining(r.remaining);
        if (!r.ref) break;
        skip.push(r.ref);
        if (r.ok) setDone((d) => [...d, r.ref!]);
        else setFailed((f) => [...f, { ref: r.ref!, error: r.error ?? "failed" }]);
      }
    } catch (e) {
      setFailed((f) => [...f, { ref: "—", error: e instanceof Error ? e.message : "failed" }]);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card className="bg-admin-surface">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-medium"><Box className="h-4 w-4" />3D models from photos</p>
            <p className="text-sm text-muted-foreground">
              Builds the 3D view for every active home without one: AI reads the photos, and the real facade photos are mapped onto the model.
            </p>
          </div>
          {running ? (
            <Button variant="outline" onClick={() => { stop.current = true; }}><Square className="mr-1.5 h-4 w-4" />Stop after current home</Button>
          ) : (
            <Button onClick={run}><Box className="mr-1.5 h-4 w-4" />Generate missing 3D models</Button>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={upgrade} onCheckedChange={(v) => setUpgrade(v === true)} disabled={running} />
          Also rebuild older models that have no photo facades
        </label>
        {(running || done.length > 0 || failed.length > 0) && (
          <div className="text-sm">
            {running && <span className="mr-3 inline-flex items-center gap-1.5"><Loader2 className="h-4 w-4 animate-spin" />Working…</span>}
            <span className="mr-3">Built: {done.length}</span>
            {remaining !== null && <span className="mr-3">Remaining: {remaining}</span>}
            {failed.length > 0 && (
              <span className="text-destructive">Failed: {failed.map((f) => `REF ${f.ref} (${f.error})`).join(", ")}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
