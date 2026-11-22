// English source for the customer portal. Other languages live in portalCopy.i18n.json (scripts/translate-portal.ts).
import i18n from "./portalCopy.i18n.json";

export const EN = {
  meta: { title: "My Future Homes | Customer Portal", description: "Follow your purchase, message your adviser, open requests, see contracts and payments, and get AI investment analysis of your homes." },
  hero: { eyebrow: "My Future Homes", title: "Your customer portal", description: "Everything about your purchase in one place – your adviser, requests, contracts, payments, saved homes and an AI assistant." },
  signInTitle: "Sign in to your portal",
  signedInAs: "Signed in as",
  signOut: "Sign out",
  tabs: { overview: "Overview", tickets: "Requests", messages: "Messages", documents: "Contracts & documents", payments: "Payments", saved: "Saved homes", analysis: "AI investment analysis", assistant: "AI assistant", academy: "Academy", profile: "Profile" },
  stages: { viewing: "Viewing", reservation: "Reservation", contract: "Contract", payment: "Payment", handover: "Handover", aftersales: "After sales" },
  overview: { progress: "Your purchase", next: "Next step", nextByStage: { viewing: "Book a viewing or video call with your adviser.", reservation: "Sign the reservation agreement and pay the deposit.", contract: "Review and sign your sales contract.", payment: "Follow your payment plan below.", handover: "Prepare the title deed transfer and key handover.", aftersales: "Ask us about rentals, furnishing or management." }, adviser: "Your adviser", noLead: "We could not find an existing customer file for this e-mail yet. Send us a message and your adviser will link it.", openTickets: "Open requests", unread: "New messages", documents: "Shared documents" },
  tickets: { new: "New request", category: "Type", categories: { question: "Question", viewing: "Viewing / video call", documents: "Documents", payment: "Payment", after_sales: "After sales", other: "Other" }, subject: "Subject", details: "Describe what you need", propertyRef: "Property REF (optional)", preferredAt: "Preferred date & time (optional)", submit: "Send request", empty: "No requests yet.", status: { open: "Open", in_progress: "In progress", resolved: "Resolved" }, reply: "Write a reply", send: "Send", created: "Request sent – your adviser will reply here." },
  messages: { empty: "Write to your adviser – we usually reply within a few hours.", placeholder: "Type a message…", send: "Send", team: "Future Homes", you: "You" },
  documents: { empty: "Documents your adviser shares with you (contracts, quotes, invoices) appear here.", download: "Download", sign: "Sign now", signed: "Signed", quote: "Quote", invoice: "Invoice", document: "Document", signature: "Contract for signature" },
  payments: { empty: "No invoices yet.", due: "Due", paid: "Paid", remaining: "Remaining", amount: "Amount" },
  saved: { title: "Saved homes", alerts: "Smart Property Alerts", empty: "No saved homes yet. Tap the heart on any home to save it.", analyse: "Analyse", compare: "Compare selected", browse: "Browse homes" },
  analysis: { intro: "Pick one of your saved homes or enter a REF. We calculate costs, rental income and 5–10 year outcomes with our market data, and AI writes an assessment.", ref: "Property REF", nightly: "Expected nightly rate (optional)", run: "Analyse investment", running: "Analysing…", history: "Your analyses", purchaseCosts: "Purchase costs", netYear: "Net rental income / year", grossYield: "Gross yield", cashOnCash: "Net return", value10y: "Value in 10 years", strengths: "Strengths", risks: "Risks", area: "Area comparison", recommendation: "Recommendation", scenarios: "Scenarios", disclaimer: "Indicative figures, not financial advice. Confirm with your adviser and local professionals." },
  assistant: { intro: "Ask about your homes, documents, the buying process, fees, title deeds, residence permits or citizenship. I can also open a request for your adviser.", placeholder: "Ask anything…", send: "Send", thinking: "Thinking…", ticketCreated: "I opened a request for your adviser.", suggestions: ["What are the next steps in my purchase?", "What costs come on top of the price in Turkey?", "How does citizenship by investment work?", "Book a viewing for my saved homes"] },
  profile: { name: "Full name", phone: "Phone / WhatsApp", language: "Preferred language", budget: "Budget", wishes: "What are you looking for?", save: "Save", saved: "Saved" },
  academy: { tab: "Academy", intro: "Learn everything about buying property abroad – at your own pace.", lessons: "lessons", done: "Done", markDone: "Mark as done", open: "Open lesson", exam: "Final exam", certificate: "Certificate ready – congratulations!", min: "min", continue: "Continue" },
  portalMore: "More",
  error: "Something went wrong – please try again.",
};

export type PortalCopy = typeof EN;
const ALL = i18n as unknown as Record<string, PortalCopy>;
export function portalCopy(lang?: string | null): PortalCopy {
  return (lang && ALL[lang]) || EN;
}
