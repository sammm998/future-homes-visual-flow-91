import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Admin-only: (re)builds a home's 3D building description from its photos with Claude. */
export const generateBuilding3d = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { ref: string }) => ({ ref: String(d.ref) }))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await (context.supabase as any).rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Admins only");
    const { data: p, error } = await context.supabase.from("properties").select("property_images, interior_images").eq("ref_no", data.ref).maybeSingle();
    if (error || !p) throw new Error("Property not found");
    const { analyzeBuilding } = await import("./building3d.server");
    const spec = await analyzeBuilding([...((p as any).property_images ?? []), ...((p as any).interior_images ?? [])]);
    const { error: upErr } = await context.supabase.from("properties").update({ model_3d: spec as any } as any).eq("ref_no", data.ref);
    if (upErr) throw new Error(upErr.message);
    return { floors: spec.floors, rooms: spec.rooms.length };
  });
