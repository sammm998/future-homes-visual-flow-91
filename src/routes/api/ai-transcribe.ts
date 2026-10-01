import { createFileRoute } from "@tanstack/react-router";
import { transcribeAudio } from "@/lib/aiSearch.server";

export const Route = createFileRoute("/api/ai-transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "Voice search is not configured." }, { status: 500 });
        try {
          const form = await request.formData();
          const file = form.get("file");
          if (!(file instanceof File) || !file.size || file.size > 10 * 1024 * 1024 || !file.type.startsWith("audio/")) {
            return Response.json({ error: "Invalid recording." }, { status: 400 });
          }
          const text = await transcribeAudio(apiKey, file);
          return Response.json({ text });
        } catch (e: any) {
          const status = typeof e?.status === "number" ? e.status : 500;
          console.error("ai-transcribe failed", status, e?.message);
          return Response.json({ error: status === 429 ? "Please try again in a moment." : "Could not understand the recording. Please try again or type instead." }, { status });
        }
      },
    },
  },
});
