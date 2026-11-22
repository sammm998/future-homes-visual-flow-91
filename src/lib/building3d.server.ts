import { generateMessage } from "@lovable.dev/ai-gateway";
import { normalizeBuildingSpec, type BuildingSpec } from "./building3d";
import { getOptimizedImageUrl } from "@/utils/imageOptimization";

const PROMPT = `You are an architectural visualiser reconstructing ONE residential development as a 3D model from its listing photos.
Images are numbered from 0 in the order given. Study every exterior photo and describe the real building as faithfully as possible.

Return ONLY JSON, no prose:
{
 "kind": "apartment_block|tower|villa|townhouses|complex",
 "footprint": "rectangle|L|U",
 "floors": int (total above-ground storeys of the main block, counting podium storeys),
 "podiumFloors": int 0-4 (storeys of a wider base for shops/lobby/parking; 0 if none),
 "width": metres along the face that appears LEFT of the building corner nearest the camera in the main exterior photo,
 "depth": metres along the face that appears RIGHT of that corner (estimate from window bays ≈ 3.4 m each),
 "blocks": 1-6 (identical blocks in the development), "blockLayout": "row|grid|staggered",
 "facadeColor": "#rrggbb" (main wall colour), "secondaryColor": "#rrggbb" (second cladding / spandrel band),
 "accentColor": "#rrggbb" (window frames, railings, trims), "glassColor": "#rrggbb", "podiumColor": "#rrggbb", "roofColor": "#rrggbb",
 "material": "render|stone|concrete|wood|brick|glass" (dominant wall finish),
 "windowStyle": "floor_to_ceiling|punched|ribbon", "windowRatio": 0.2-0.95 (share of facade that is glass),
 "balconies": "none|projecting|recessed|wraparound", "railing": "glass|metal|solid", "corners": "sharp|rounded",
 "roof": "flat|terrace|pitched|pergola", "hasPool": bool, "greenery": "low|medium|high", "palms": bool,
 "setting": "seaside|city|hills|tropical|suburban",
 "facades": [{"imageIndex": int, "side": "left|right", "quad": [[x,y],[x,y],[x,y],[x,y]]}],
 "rooms": [{"imageIndex": int, "type": "living|bedroom|kitchen|bathroom|terrace|lobby|gym|spa|other", "label": "short English name"}]
}

facades — this makes the model look like the real building, so be precise:
- Use the single best exterior photo where the whole main block is visible (prefer a corner view showing two faces; a straight front view gives one face).
- For each clearly visible face of the main block give its outline as the four corners in order top-left, top-right, bottom-right, bottom-left,
  as fractions of the image width and height (x 0 = left edge, y 0 = top edge). Follow the building's real edges: the roof line at the top
  and the ground line (or the top of the podium when podiumFloors > 0) at the bottom — not the photo frame, trees or neighbouring buildings.
- "side": "left" for the face left of the nearest vertical corner, "right" for the face right of it. A single frontal face is "left".
- Omit facades when no photo shows the whole block (interiors, aerial plans, cropped or heavily occluded views).
rooms — only genuine interior or private-terrace photos, one per distinct room; never exteriors, facade renders, maps or floor plans.`;

/** Listing photo as a reasonably sized URL the AI gateway can fetch quickly. */
const forAnalysis = (u: string) => getOptimizedImageUrl(u, 1600, 85);

export async function analyzeBuilding(images: string[]): Promise<BuildingSpec> {
  const imgs = [...new Set(images.filter((u) => typeof u === "string" && /^https:\/\//.test(u)))].slice(0, 16);
  if (!imgs.length) throw new Error("This home has no photos to analyse");
  const res: any = await generateMessage({
    model: "anthropic/claude-sonnet-5",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: [
          ...imgs.flatMap((url, i) => [
            { type: "text" as const, text: `Image ${i}:` },
            { type: "image" as const, source: { type: "url" as const, url: forAnalysis(url) } },
          ]),
          { type: "text" as const, text: PROMPT },
        ],
      },
    ],
  } as any);
  const text = (res?.content ?? []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  // Stored specs reference the original photo URLs (the viewer resizes them).
  return normalizeBuildingSpec(JSON.parse(json), imgs);
}
