import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import type { Role } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Register — School Samadhana" },
      { name: "description", content: "Secure login for students, parents and school officials of Karnataka government schools." },
      { property: "og:title", content: "Login or Register — School Samadhana" },
      { property: "og:description", content: "Role-based access for students, parents and officials." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roll, setRoll] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName, role, roll_number: roll },
          },
        });
        if (err) throw err;
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="gov-container max-w-xl py-12">
      <h1 className="text-2xl font-bold text-foreground">{t("auth.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("auth.note")}</p>

      <div className="mt-6 flex overflow-hidden rounded-md border border-border" role="tablist">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`flex-1 px-4 py-2 text-sm font-medium ${mode === m ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
          >
            {t(`auth.${m}`)}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-5 rounded-md border border-border bg-card p-6 shadow-card">
        <fieldset>
          <legend className="text-sm font-medium text-foreground">{t("auth.role")}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["student", "parent", "official"] as const).map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={role === r}
                onClick={() => setRole(r)}
                className={`rounded-sm border px-3 py-2 text-sm ${role === r ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"}`}
              >
                {t(`auth.role.${r}`)}
              </button>
            ))}
          </div>
        </fieldset>

        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="name">{t("auth.name")}</Label>
            <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {mode === "register" && role !== "official" && (
          <div className="space-y-2">
            <Label htmlFor="roll">{t("auth.roll")}</Label>
            <Input id="roll" value={roll} onChange={(e) => setRoll(e.target.value)} />
            <p className="text-xs text-muted-foreground">{t("auth.roll.help")}</p>
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" disabled={busy} className="w-full">
          {t(mode === "login" ? "auth.submit.login" : "auth.submit.register")}
        </Button>
      </form>
    </div>
  );
}
