import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { StatusTimeline } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = ["infrastructure", "teacher", "safety", "meal", "other"] as const;

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit a School Problem — School Samadhana" },
      { name: "description", content: "Report infrastructure, teacher shortage, safety or mid-day meal problems and receive a trackable ticket ID." },
      { property: "og:title", content: "Submit a School Problem — School Samadhana" },
      { property: "og:description", content: "Step-by-step grievance form with an instant ticket ID." },
    ],
  }),
  component: SubmitPage,
});

function SubmitPage() {
  const { t } = useI18n();
  const { session, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [school, setSchool] = useState("");
  const [category, setCategory] = useState<string>("infrastructure");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [ticket, setTicket] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <p className="gov-container py-12 text-sm text-muted-foreground">{t("common.loading")}</p>;

  if (!session) {
    return (
      <div className="gov-container py-16 text-center">
        <p className="text-sm text-muted-foreground">{t("auth.needLogin")}</p>
        <Button asChild className="mt-4">
          <Link to="/auth">{t("auth.goLogin")}</Link>
        </Button>
      </div>
    );
  }

  async function submit() {
    setBusy(true);
    setError("");
    const { data, error: err } = await supabase
      .from("complaints")
      .insert({
        school_name: school,
        category,
        description,
        photo_url: photo || null,
        created_by: session!.user.id,
      })
      .select("ticket_id")
      .single();
    setBusy(false);
    if (err || !data) {
      setError(err?.message ?? t("common.error"));
      return;
    }
    setTicket(data.ticket_id);
  }

  if (ticket) {
    return (
      <div className="gov-container max-w-xl py-12">
        <div className="rounded-md border border-border bg-card p-6 shadow-card">
          <h1 className="text-xl font-bold text-success">{t("complaint.success")}</h1>
          <p className="mt-4 text-sm text-muted-foreground">{t("complaint.ticket")}</p>
          <p className="text-2xl font-bold tracking-wide text-foreground">{ticket}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("complaint.saveTicket")}</p>
          <div className="mt-6">
            <StatusTimeline status="submitted" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/track">{t("nav.track")}</Link>
            </Button>
            <Button
              onClick={() => {
                setTicket(null);
                setStep(1);
                setSchool("");
                setDescription("");
                setPhoto("");
              }}
            >
              {t("complaint.another")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canNext = step === 1 ? school.trim().length > 0 : step === 3 ? description.trim().length > 0 : true;

  return (
    <div className="gov-container max-w-xl py-12">
      <h1 className="text-2xl font-bold text-foreground">{t("complaint.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("complaint.step")} {step} {t("complaint.of")} 4
      </p>

      <div className="mt-6 space-y-5 rounded-md border border-border bg-card p-6 shadow-card">
        {step === 1 && (
          <div className="space-y-2">
            <Label htmlFor="school">{t("complaint.school")}</Label>
            <Input id="school" value={school} onChange={(e) => setSchool(e.target.value)} required />
          </div>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="text-sm font-medium text-foreground">{t("complaint.category")}</legend>
            <div className="mt-3 grid gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={`rounded-sm border px-3 py-2 text-left text-sm ${category === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"}`}
                >
                  {t(`cat.${c}`)}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <div className="space-y-2">
            <Label htmlFor="desc">{t("complaint.description")}</Label>
            <Textarea id="desc" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-2">
            <Label htmlFor="photo">{t("complaint.photo")}</Label>
            <Input id="photo" type="url" value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://" />
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex justify-between gap-3">
          <Button type="button" variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
            {t("complaint.back")}
          </Button>
          {step < 4 ? (
            <Button type="button" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
              {t("complaint.next")}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={busy}
              onClick={submit}
              className="bg-saffron text-saffron-foreground hover:bg-saffron/90"
            >
              {t("complaint.submit")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
