import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { StatusTimeline, type ComplaintStatus } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Complaint Status — Shiksha Sahaya" },
      { name: "description", content: "Follow the live status timeline of every grievance you submitted, from Submitted to Under Review to Resolved." },
      { property: "og:title", content: "Track Complaint Status — Shiksha Sahaya" },
      { property: "og:description", content: "Search your ticket ID and see the official response." },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const { t } = useI18n();
  const { session, loading } = useAuth();
  const [q, setQ] = useState("");
  const userId = session?.user.id;

  const { data, isLoading } = useQuery({
    enabled: !!userId,
    queryKey: ["my-complaints", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("complaints")
        .select("*")
        .eq("created_by", userId!)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

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

  const list = (data ?? []).filter((c) => c.ticket_id.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="gov-container max-w-3xl py-10">
      <h1 className="text-2xl font-bold text-foreground">{t("track.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("track.sub")}</p>

      <div className="mt-6 space-y-2">
        <Label htmlFor="q">{t("track.search")}</Label>
        <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="KS-2026-0001" />
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : list.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">{t("dash.none")}</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {list.map((c) => (
            <li key={c.id} className="rounded-md border border-border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-foreground">{c.ticket_id}</p>
                <p className="text-xs text-muted-foreground">
                  {t("common.date")}: {new Date(c.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(`cat.${c.category}`)} · {c.school_name}
              </p>
              <p className="mt-3 text-sm text-foreground">{c.description}</p>
              <div className="mt-4">
                <StatusTimeline status={c.status as ComplaintStatus} />
              </div>
              {c.official_response && (
                <div className="mt-4 rounded-sm border border-border bg-background p-3">
                  <p className="text-xs font-semibold text-foreground">{t("track.response")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.official_response}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
