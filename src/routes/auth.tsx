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
      { title: "Login or Register — Shiksha Sahaya" },
      { name: "description", content: "Secure login with register number and date of birth for students, parents and school officials of Karnataka government schools." },
      { property: "og:title", content: "Login or Register — Shiksha Sahaya" },
      { property: "og:description", content: "Role-based access for students, parents and officials." },
    ],
  }),
  component: AuthPage,
});

/** Register numbers are the credential; a stable internal address is derived from them. */
function accountEmail(regNo: string) {
  const clean = regNo.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${clean}@shikshasahaya.app`;
}

function AuthPage() {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("student");
  const [fullName, setFullName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [classLevel, setClassLevel] = useState("8");
  const [school, setSchool] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const cleanReg = regNo.trim();
    if (cleanReg.replace(/[^a-zA-Z0-9]/g, "").length < 3) {
      setError(t("auth.regno") + " ✕");
      return;
    }
    if (mode === "register" && !/^[0-9]{10}$/.test(phone.trim())) {
      setError(t("auth.phone.help"));
      return;
    }
    if (!dob) {
      setError(t("auth.dob.help"));
      return;
    }

    setBusy(true);
    try {
      const email = accountEmail(cleanReg);
      const password = `${dob}#${cleanReg.toUpperCase()}`;

      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw new Error(t("auth.badCreds"));
      } else {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: fullName.trim(),
              role,
              roll_number: cleanReg.toUpperCase(),
              phone: phone.trim(),
              class_level: classLevel,
              school_name: school.trim() || "Government School",
            },
          },
        });
        if (err) {
          throw new Error(/already|registered|exists/i.test(err.message) ? t("auth.exists") : err.message);
        }
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) throw new Error(signInErr.message);
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div aria-hidden="true" className="gov-tricolor" />
      <div className="gov-hero">
        <div className="gov-container flex flex-wrap items-center gap-3 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-primary-foreground/30 bg-primary-foreground/10 text-sm font-bold">
            ಕ
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold">{t("site.name")}</p>
            <p className="truncate text-xs text-primary-foreground/80">{t("site.tagline")}</p>
          </div>
          <div role="group" aria-label="Language" className="flex overflow-hidden rounded-sm border border-primary-foreground/30 text-xs">
            <button type="button" onClick={() => setLang("en")} aria-pressed={lang === "en"}
              className={`px-2 py-1 ${lang === "en" ? "bg-primary-foreground text-primary" : "hover:bg-primary-foreground/10"}`}>English</button>
            <button type="button" onClick={() => setLang("kn")} aria-pressed={lang === "kn"}
              className={`px-2 py-1 ${lang === "kn" ? "bg-primary-foreground text-primary" : "hover:bg-primary-foreground/10"}`}>ಕನ್ನಡ</button>
          </div>
        </div>
      </div>

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
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`flex-1 px-4 py-2 text-sm font-medium ${mode === m ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
            >
              {t(`auth.${m}`)}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-5 rounded-md border border-border bg-card p-6 shadow-card">
          {mode === "register" && (
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
          )}

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">{t("auth.name")}</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="regno">{t("auth.regno")}</Label>
            <Input
              id="regno"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              required
              maxLength={30}
              autoComplete="username"
              placeholder="KS1001"
            />
            <p className="text-xs text-muted-foreground">{mode === "register" ? t("auth.regno.help") : t("auth.roll.help")}</p>
          </div>

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="phone">{t("auth.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                required
                placeholder="9876543210"
              />
              <p className="text-xs text-muted-foreground">{t("auth.phone.help")}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dob">{t("auth.dob")}</Label>
            <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required max="2020-12-31" />
            <p className="text-xs text-muted-foreground">{t("auth.dob.help")}</p>
          </div>

          {mode === "register" && role === "student" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="class">{t("auth.class")}</Label>
                <select
                  id="class"
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">{t("auth.school")}</Label>
                <Input id="school" value={school} onChange={(e) => setSchool(e.target.value)} maxLength={120} />
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-sm border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" disabled={busy} className="w-full">
            {t(mode === "login" ? "auth.submit.login" : "auth.submit.register")}
          </Button>
        </form>
      </div>
    </div>
  );
}
