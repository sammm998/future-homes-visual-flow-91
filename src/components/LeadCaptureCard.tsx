import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2 } from "lucide-react";
import { saveLead } from "@/lib/leads.functions";
import { getPartnerRef } from "@/hooks/useMember";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LeadCaptureCard({
  title,
  description,
  source,
  details,
  cta = "Send to me",
  extra,
}: {
  title: string;
  description: string;
  source: string;
  details: string;
  cta?: string;
  extra?: string;
}) {
  const save = useServerFn(saveLead);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email && !form.phone) return setState("error");
    setState("busy");
    try {
      const res = await save({ data: { ...form, source, partnerRef: getPartnerRef(), message: [extra, details].filter(Boolean).join("\n\n").slice(0, 4000) } });
      setState(res.saved ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done")
    return (
      <div className="rounded-lg border border-gold/40 bg-card p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-gold" />
        <p className="mt-3 font-semibold text-foreground">Thank you – an adviser will contact you shortly.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-5 sm:p-6">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input placeholder="Phone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      {state === "error" ? <p className="mt-2 text-sm text-destructive">Please add an email or phone number and try again.</p> : null}
      <Button type="submit" disabled={state === "busy"} className="mt-4 w-full bg-navy text-navy-foreground hover:bg-navy/90 sm:w-auto">
        {state === "busy" ? "Sending…" : cta}
      </Button>
    </form>
  );
}
