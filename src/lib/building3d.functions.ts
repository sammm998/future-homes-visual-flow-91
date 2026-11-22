import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type AuthedContext = { supabase: any; userId: string };

async function assertAdmin(context: AuthedContext) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!isAdmin) throw new Error("Admins only");
}

async function buildFor(context: AuthedContext, ref: string) {
  const { data: p, error } = await context.supabase
    .from("properties")
    .select("property_image, property_images, interior_images")
    .eq("ref_no", ref)
    .maybeSingle();
  if (error || !p) throw new Error("Property not found");
  const { analyzeBuilding } = await import("./building3d.server");
  // Cover photo first: it is usually the best full exterior view.
  const spec = await analyzeBuilding([p.property_image, ...(p.property_images ?? []), ...(p.interior_images ?? [])].filter(Boolean));
  const { error: upErr } = await context.supabase.from("properties").update({ model_3d: spec as any } as any).eq("ref_no", ref);
  if (upErr) throw new Error(upErr.message);
  return spec;
}

/** Admin-only: (re)builds a home's 3D building description from its photos with Claude. */
export const generateBuilding3d = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { ref: string }) => ({ ref: String(d.ref) }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as AuthedContext);
    const spec = await buildFor(context as AuthedContext, data.ref);
    return { floors: spec.floors, rooms: spec.rooms.length, photoFacades: spec.facades.length };
  });

/**
 * Admin-only: builds the 3D model for the next active home that has none (or
 * an older model without photo facades when `upgrade` is set). One home per
 * call keeps each request short; the admin page calls it until `remaining` is 0.
 */
export const generateNextBuilding3d = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { upgrade?: boolean; skip?: string[] }) => ({
    upgrade: Boolean(d?.upgrade),
    skip: Array.isArray(d?.skip) ? d.skip.map(String).slice(0, 500) : [],
  }))
  .handler(async ({ data, context }) => {
    const ctx = context as AuthedContext;
    await assertAdmin(ctx);
    const { data: rows, error } = await ctx.supabase
      .from("properties")
      .select("ref_no, model_3d")
      .eq("is_active", true)
      .not("ref_no", "is", null)
      .order("ref_no", { ascending: true })
      .limit(2000);
    if (error) throw new Error(error.message);
    const todo = (rows ?? []).filter((r: any) => {
      if (data.skip.includes(String(r.ref_no))) return false;
      if (!r.model_3d) return true;
      return data.upgrade && !(Array.isArray(r.model_3d?.facades) && r.model_3d.facades.length);
    });
    const next = todo[0];
    if (!next) return { ref: null, remaining: 0, ok: true as const };
    try {
      const spec = await buildFor(ctx, String(next.ref_no));
      return { ref: String(next.ref_no), remaining: todo.length - 1, ok: true as const, photoFacades: spec.facades.length };
    } catch (e) {
      return { ref: String(next.ref_no), remaining: todo.length - 1, ok: false as const, error: e instanceof Error ? e.message : "failed" };
    }
  });
