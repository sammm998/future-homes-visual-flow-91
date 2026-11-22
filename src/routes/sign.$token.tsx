import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/sign/$token")({
  head: () => ({
    meta: [
      { title: "Sign your agreement | Future Homes International" },
      { name: "description", content: "Review and sign your Future Homes International agreement securely online." },
      { property: "og:title", content: "Sign your agreement | Future Homes International" },
      { property: "og:description", content: "Review and sign your agreement securely online." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SignPage,
});

type Req = { title: string; body: string; signer_name: string; status: string; usable: boolean; signed_at: string | null };

function SignPage() {
  const { token } = Route.useParams();
  const [req, setReq] = useState<Req | null>(null);
  const [state, setState] = useState<"loading" | "missing" | "ready" | "done">("loading");
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    fetch(`/api/public/sign?token=${encodeURIComponent(token)}`).then(async (r) => {
      if (!r.ok) return setState("missing");
      const d = (await r.json()) as Req;
      setReq(d); setName(d.signer_name); setState(d.status === "signed" ? "done" : "ready");
    }).catch(() => setState("missing"));
  }, [token]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * e.currentTarget.width, ((e.clientY - r.top) / r.height) * e.currentTarget.height] as const;
  };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = e.currentTarget.getContext("2d"); if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true; const [x, y] = pos(e);
    ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.strokeStyle = "#071827"; ctx.beginPath(); ctx.moveTo(x, y);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext("2d"); if (!ctx) return;
    const [x, y] = pos(e); ctx.lineTo(x, y); ctx.stroke(); setDrawn(true);
  };
  const clear = () => { const c = canvas.current; c?.getContext("2d")?.clearRect(0, 0, c.width, c.height); setDrawn(false); };

  const submit = async () => {
    if (!canvas.current) return;
    setBusy(true); setErr("");
    const res = await fetch("/api/public/sign", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name, signature: canvas.current.toDataURL("image/png"), agree }),
    });
    setBusy(false);
    if (res.ok) setState("done"); else setErr(res.status === 410 ? "This signing link has expired." : "Could not save your signature. Please try again.");
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Future Homes International</p>
        {state === "loading" && <p>Loading…</p>}
        {state === "missing" && <h1 className="text-2xl font-semibold">This signing link is not valid.</h1>}
        {state === "done" && <h1 className="text-2xl font-semibold">Thank you — the agreement is signed.</h1>}
        {state === "ready" && req && (
          <>
            <h1 className="text-3xl font-semibold">{req.title}</h1>
            <article className="whitespace-pre-wrap rounded-lg border bg-card p-6 text-sm leading-relaxed">{req.body}</article>
            {!req.usable ? <p className="text-destructive">This signing link has expired. Please contact your advisor.</p> : (
              <div className="space-y-4 rounded-lg border bg-card p-6">
                <label className="block text-sm font-medium">Full name<Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} /></label>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm font-medium">Signature<button type="button" className="text-xs underline" onClick={clear}>Clear</button></div>
                  <canvas ref={canvas} width={600} height={180} className="w-full touch-none rounded border bg-background"
                    onPointerDown={down} onPointerMove={move} onPointerUp={() => (drawing.current = false)} />
                </div>
                <label className="flex items-start gap-2 text-sm"><Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} />I have read the agreement and sign it electronically.</label>
                {err && <p className="text-sm text-destructive">{err}</p>}
                <Button disabled={busy || !agree || !drawn || name.trim().length < 2} onClick={submit}>{busy ? "Signing…" : "Sign agreement"}</Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
