import { generateMessage } from "@lovable.dev/ai-gateway";
import { normalizeBuildingSpec, type BuildingSpec } from "./building3d";

const PROMPT = `You are an architect reconstructing a residential building from listing photos.
Images are numbered from 0 in the order given. Return ONLY JSON:
{"floors":int (above-ground storeys of the main block),"width":metres,"depth":metres,"blocks":1-4 similar blocks,
"facadeColor":"#rrggbb","accentColor":"#rrggbb" (cladding/frames),"glassColor":"#rrggbb",
"balconies":"none|projecting|recessed|wraparound","roof":"flat|terrace|pitched","hasPool":bool,"greenery":"low|medium|high",
"rooms":[{"imageIndex":int,"type":"living|bedroom|kitchen|bathroom|terrace|lobby|gym|spa|other","label":"short English name"}]}
List in rooms ONLY genuine interior or private-terrace photos, one per distinct room, never exteriors, renders of the facade, maps or floor plans.`;

export async function analyzeBuilding(images: string[]): Promise<BuildingSpec> {
  const imgs = images.filter((u) => /^https:\/\//.test(u)).slice(0, 16);
  const res: any = await generateMessage({
    model: "anthropic/claude-sonnet-5",
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: [
        ...imgs.map((url) => ({ type: "image" as const, source: { type: "url" as const, url } })),
        { type: "text" as const, text: PROMPT },
      ],
    }],
  } as any);
  const text = (res?.content ?? []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return normalizeBuildingSpec(JSON.parse(json), imgs);
}
