import { useState } from "react";
import { supabase as cloud } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MemberAuthCard({ title = "Join the free VIP Club", next = "/vip" }: { title?: string; next?: string }) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "signup") {
      const { data, error } = await cloud.auth.signUp({
        email,
        password,
        options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}${next}` },
      });
      if (error) setMsg(error.message);
      else if (!data.session) setMsg("Check your email and click the confirmation link to activate your membership.");
    } else {
      const { error } = await cloud.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    }
    setBusy(false);
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}${next}` });
    if (r.error) setMsg("Google sign-in failed. Please try again.");
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-luxe)] sm:p-8">
      <h2 className="text-2xl font-semibold text-foreground">{mode === "signup" ? title : "Welcome back"}</h2>
      <Button type="button" variant="outline" className="mt-5 w-full" onClick={google}>Continue with Google</Button>
      <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
      <form onSubmit={submit} className="space-y-3">
        {mode === "signup" ? <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required /> : null}
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password (min. 6 characters)" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
        {msg ? <p className="text-sm text-muted-foreground">{msg}</p> : null}
        <Button type="submit" disabled={busy} className="w-full bg-navy text-navy-foreground hover:bg-navy/90">
          {busy ? "Please wait…" : mode === "signup" ? "Create free account" : "Sign in"}
        </Button>
      </form>
      <button type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="mt-4 text-sm text-muted-foreground underline">
        {mode === "signup" ? "Already a member? Sign in" : "New here? Create a free account"}
      </button>
    </div>
  );
}
