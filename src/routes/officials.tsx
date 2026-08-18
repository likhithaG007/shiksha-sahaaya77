import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { StatusBadge, type ComplaintStatus } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STATUSES: ComplaintStatus[] = ["submitted", "under_review", "resolved"];

export const Route = createFileRoute("/officials")({
  head: () => ({
    meta: [
      { title: "Officials Panel — Shiksha Sahaya" },
      { name: "description", content: "Verified officials review, respond to and resolve school grievances with filters by status, category and school." },
      { property: "og:title", content: "Officials Panel — Shiksha Sahaya" },
      { property: "og:description", content: "Review and resolve submitted school grievances." },
    ],
  }),
  component: OfficialsPage,
});

function OfficialsPage() {
  const { t } = useI18n();
  const { role, loading } = useAuth();
  const qc = useQueryClient();
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [school, setSchool] = useState("all");
  const [drafts, setDrafts] = useState<Record<string, { status: ComplaintStatus; note: string }>>({});

  const { data, isLoading } = useQuery({
    enabled: role === "official",
    queryKey: ["all-complaints"],
    queryFn: async () => {
      const { data } = await supabase.from("complaints").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  if (loading) return <p className="gov-container py-12 text-sm text-muted-foreground">{t("common.loading")}</p>;
  if (role !== "official") return <p className="gov-container py-16 text-sm text-muted-foreground">{t("off.notOfficial")}</p>;

  const items = data ?? [];
  const schools = [...new Set(items.map((i) => i.school_name))].sort();
  const categories = [...new Set(items.map((i) => i.category))].sort();

  const filtered = items.filter(
    (c) =>
      (status === "all" || c.status === status) &&
      (category === "all" || c.category === category) &&
      (school === "all" || c.school_name === school),
  );

  async function update(id: string, current: { status: ComplaintStatus; official_response: string | null }) {
    const draft = drafts[id] ?? { status: current.status, note: current.official_response ?? "" };
    await supabase
      .from("complaints")
      .update({ status: draft.status, official_response: draft.note || null })
      .eq("id", id);
    await supabase.from("complaint_updates").insert({ complaint_id: id, status: draft.status, note: draft.note || null });
    qc.invalidateQueries({ queryKey: ["all-complaints"] });
  }

  return (
    <div className="gov-container py-10">
      <h1 className="text-2xl font-bold text-foreground">{t("off.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("off.sub")}</p>

      <div className="mt-6 grid gap-4 rounded-md border border-border bg-card p-5 shadow-card sm:grid-cols-3">
        <Filter id="f-status" label={t("off.filter.status")} value={status} onChange={setStatus} options={STATUSES.map((s) => [s, t(`status.${s}`)])} allLabel={t("off.all")} />
        <Filter id="f-cat" label={t("off.filter.category")} value={category} onChange={setCategory} options={categories.map((c) => [c, t(`cat.${c}`)])} allLabel={t("off.all")} />
        <Filter id="f-school" label={t("off.filter.school")} value={school} onChange={setSchool} options={schools.map((s) => [s, s])} allLabel={t("off.all")} />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {filtered.length} {t("off.count")}
      </p>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {filtered.map((c) => {
            const draft = drafts[c.id] ?? { status: c.status as ComplaintStatus, note: c.official_response ?? "" };
            return (
              <li key={c.id} className="rounded-md border border-border bg-card p-5 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">{c.ticket_id}</p>
                  <StatusBadge status={c.status as ComplaintStatus} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t(`cat.${c.category}`)} · {c.school_name} · {new Date(c.created_at).toLocaleDateString()}
                </p>
                <p className="mt-3 text-sm text-foreground">{c.description}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-[200px_1fr] sm:items-end">
                  <div className="space-y-2">
                    <Label htmlFor={`st-${c.id}`}>{t("off.filter.status")}</Label>
                    <select
                      id={`st-${c.id}`}
                      value={draft.status}
                      onChange={(e) =>
                        setDrafts((d) => ({ ...d, [c.id]: { ...draft, status: e.target.value as ComplaintStatus } }))
                      }
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {t(`status.${s}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`note-${c.id}`}>{t("off.responseNote")}</Label>
                    <Textarea
                      id={`note-${c.id}`}
                      rows={2}
                      value={draft.note}
                      onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: { ...draft, note: e.target.value } }))}
                    />
                  </div>
                </div>

                <Button
                  className="mt-3"
                  onClick={() => update(c.id, { status: c.status as ComplaintStatus, official_response: c.official_response })}
                >
                  {t("off.update")}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Filter({
  id,
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
  allLabel: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="all">{allLabel}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
