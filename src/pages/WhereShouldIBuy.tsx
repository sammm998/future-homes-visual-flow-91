import { useState } from "react";
import Navigation from "@/components/Navigation";
import { PublicPageHero } from "@/components/PublicEditorial";
import LeadCaptureCard from "@/components/LeadCaptureCard";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import heroImage from "@/assets/hero-modern-estate.jpg";
import { cn } from "@/lib/utils";

type Country = "turkey" | "dubai" | "cyprus" | "bali";
const COUNTRIES: Record<Country, { label: string; to: string; why: string }> = {
  turkey: { label: "Turkey", to: "/antalya", why: "Wide price range, Mediterranean climate and citizenship from $400K." },
  dubai: { label: "Dubai", to: "/dubai", why: "No rental income tax, strong short-let demand and a mature legal system." },
  cyprus: { label: "Northern Cyprus", to: "/cyprus", why: "Low entry prices, relaxed island life and attractive off-plan payment plans." },
  bali: { label: "Bali", to: "/bali", why: "Tropical lifestyle and high holiday-rental demand, with leasehold structures." },
};

type Q = { q: string; options: { label: string; score: Partial<Record<Country, number>> }[] };
const QUESTIONS: Q[] = [
  { q: "What is your budget?", options: [
    { label: "Under €150K", score: { cyprus: 3, turkey: 2, bali: 1 } },
    { label: "€150K – €400K", score: { turkey: 3, cyprus: 2, bali: 2, dubai: 1 } },
    { label: "€400K – €1M", score: { dubai: 3, turkey: 2, bali: 2 } },
    { label: "Over €1M", score: { dubai: 3, bali: 1, turkey: 1 } },
  ] },
  { q: "What is your main goal?", options: [
    { label: "Live there", score: { turkey: 2, cyprus: 2, bali: 2 } },
    { label: "Rental income", score: { dubai: 3, bali: 3, turkey: 1 } },
    { label: "Citizenship / residency", score: { turkey: 3, dubai: 2 } },
    { label: "Long-term growth", score: { dubai: 2, turkey: 2, cyprus: 2 } },
  ] },
  { q: "Which climate do you prefer?", options: [
    { label: "Mediterranean", score: { turkey: 3, cyprus: 3 } },
    { label: "Hot and sunny all year", score: { dubai: 3 } },
    { label: "Tropical", score: { bali: 3 } },
    { label: "No preference", score: {} },
  ] },
  { q: "Which lifestyle fits you?", options: [
    { label: "City and luxury", score: { dubai: 3, turkey: 1 } },
    { label: "Beach and calm", score: { cyprus: 3, turkey: 2 } },
    { label: "Nature and wellness", score: { bali: 3 } },
    { label: "Mix of everything", score: { turkey: 3 } },
  ] },
  { q: "Will you rent it out?", options: [
    { label: "Yes, short-term", score: { dubai: 2, bali: 3 } },
    { label: "Yes, long-term", score: { turkey: 2, dubai: 2 } },
    { label: "Only sometimes", score: { cyprus: 2, turkey: 1 } },
    { label: "No", score: { cyprus: 1, turkey: 1 } },
  ] },
  { q: "How much risk can you accept?", options: [
    { label: "Low – I want stability", score: { dubai: 3, turkey: 1 } },
    { label: "Medium", score: { turkey: 2, dubai: 1, bali: 1 } },
    { label: "High – for higher upside", score: { cyprus: 2, bali: 2 } },
  ] },
  { q: "When do you want to buy?", options: [
    { label: "Within 3 months", score: {} },
    { label: "Within a year", score: {} },
    { label: "Just exploring", score: {} },
  ] },
];

export default function WhereShouldIBuy() {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step === QUESTIONS.length;

  const totals: Record<Country, number> = { turkey: 0, dubai: 0, cyprus: 0, bali: 0 };
  answers.forEach((a, i) => Object.entries(QUESTIONS[i].options[a].score).forEach(([c, s]) => (totals[c as Country] += s!)));
  const max = Math.max(1, ...Object.values(totals));
  const ranked = (Object.keys(totals) as Country[]).sort((a, b) => totals[b] - totals[a]);
  const summary = answers.map((a, i) => `${QUESTIONS[i].q} ${QUESTIONS[i].options[a].label}`).join("\n");

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <PublicPageHero compact eyebrow="Where should I buy?" title="Which country fits your budget and goals?" description="Seven quick questions. We compare Turkey, Dubai, Northern Cyprus and Bali for you." image={heroImage} />
      <main className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        {!done ? (
          <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
            <div className="mb-6 h-1 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-gold transition-all" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} /></div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Question {step + 1} of {QUESTIONS.length}</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">{QUESTIONS[step].q}</h2>
            <div className="mt-6 grid gap-3">
              {QUESTIONS[step].options.map((o, i) => (
                <button key={o.label} onClick={() => setAnswers([...answers, i])} className="min-h-12 rounded-lg border border-border bg-background px-5 text-left font-medium text-foreground transition-colors hover:border-gold hover:bg-gold/10">{o.label}</button>
              ))}
            </div>
            {step > 0 ? <button onClick={() => setAnswers(answers.slice(0, -1))} className="mt-5 text-sm text-muted-foreground underline">Back</button> : null}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">Your best match: {COUNTRIES[ranked[0]].label}</h2>
            {ranked.map((c, i) => (
              <div key={c} className={cn("rounded-lg border bg-card p-5", i === 0 ? "border-gold" : "border-border")}>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-foreground">{i + 1}. {COUNTRIES[c].label}</p>
                  <span className="text-sm font-semibold text-gold-foreground">{Math.round((totals[c] / max) * 100)} % match</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-gold" style={{ width: `${(totals[c] / max) * 100}%` }} /></div>
                <p className="mt-3 text-sm text-muted-foreground">{COUNTRIES[c].why}</p>
                <Button asChild variant="outline" size="sm" className="mt-3"><Link to={COUNTRIES[c].to}>See homes in {COUNTRIES[c].label}</Link></Button>
              </div>
            ))}
            <LeadCaptureCard source="where-to-buy-quiz" title="Get a personal shortlist" description="We send you hand-picked homes in your top countries." extra={`Top match: ${COUNTRIES[ranked[0]].label}`} details={summary} cta="Send my shortlist" />
            <button onClick={() => setAnswers([])} className="text-sm text-muted-foreground underline">Start again</button>
            <p className="text-xs text-muted-foreground">This result is a general guide, not financial or legal advice.</p>
          </div>
        )}
      </main>
    </div>
  );
}
