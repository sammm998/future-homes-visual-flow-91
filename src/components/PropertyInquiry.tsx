import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveLead } from "@/lib/leads.functions";
import { cc, whatsappLink } from "@/utils/conversionCopy";

interface Props {
  refNo: string;
  title: string;
  lang: string;
  id?: string;
}

/** Enquiry card: one-tap WhatsApp with the REF prefilled, plus a short lead form. */
export function PropertyInquiry({ refNo, title, lang, id = "enquire" }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const waText = `${cc("wa_msg", lang).replace("REF", `REF ${refNo}`)} — ${title}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() && !email.trim()) return;
    setState("sending");
    try {
      const res = await saveLead({
        data: {
          name,
          phone,
          email,
          source: "property-enquiry",
          message: [`Property REF ${refNo}: ${title}`, `Language: ${lang}`, message].filter(Boolean).join("\n"),
        },
      });
      setState(res.saved ? "sent" : "error");
      if (res.saved && typeof window !== "undefined") {
        (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "generate_lead", ref: refNo });
      }
    } catch {
      setState("error");
    }
  };

  return (
    <div id={id} className="scroll-mt-24 rounded-2xl border border-primary/20 bg-card p-6 shadow-xl">
      <h3 className="text-xl font-bold text-foreground">{cc("ask_title", lang)}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{cc("ask_sub", lang)}</p>

      <Button asChild size="lg" className="mt-5 w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90">
        <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer"
          onClick={() => (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "whatsapp_click", ref: refNo })}>
          <FaWhatsapp className="mr-2 h-5 w-5" aria-hidden="true" />
          {cc("whatsapp", lang)}
        </a>
      </Button>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {cc("reply_fast", lang)}
      </p>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> {cc("or", lang)} <span className="h-px flex-1 bg-border" />
      </div>

      {state === "sent" ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden="true" />
          <p className="font-medium text-foreground">{cc("sent", lang)}</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <Input aria-label={cc("name", lang)} placeholder={cc("name", lang)} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
          <Input aria-label={cc("phone", lang)} placeholder={cc("phone", lang)} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={50} required={!email} />
          <Input aria-label={cc("email", lang)} placeholder={cc("email", lang)} type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
          <Textarea aria-label={cc("message_ph", lang)} placeholder={cc("message_ph", lang)} value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={2000} />
          <Button type="submit" size="lg" className="w-full" disabled={state === "sending"}>
            <Send className="mr-2 h-4 w-4" aria-hidden="true" />
            {state === "sending" ? cc("sending", lang) : cc("send", lang)}
          </Button>
          {state === "error" && <p className="text-sm text-destructive">{cc("error", lang)}</p>}
        </form>
      )}
    </div>
  );
}

/** Mobile-only bottom bar keeping WhatsApp + enquiry one tap away. */
export function PropertyStickyCta({ refNo, title, lang, price }: { refNo: string; title: string; lang: string; price: string }) {
  const waText = `${cc("wa_msg", lang).replace("REF", `REF ${refNo}`)} — ${title}`;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 pr-24 backdrop-blur lg:hidden">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">REF {refNo}</p>
          <p className="truncate text-sm font-bold text-primary">{price}</p>
        </div>
        <Button asChild size="sm" variant="outline">
          <a href="#enquire">{cc("get_info", lang)}</a>
        </Button>
        <Button asChild size="sm" className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90">
          <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" aria-label={cc("whatsapp", lang)}>
            <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </div>
  );
}
