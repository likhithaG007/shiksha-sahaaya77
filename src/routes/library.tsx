import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, PlayCircle, ExternalLink, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LibraryItem = {
  id: string;
  title: string;
  topic: string;
  description: string;
  subject: string;
  class_level: number;
  media_type: string;
  url: string;
  content: string;
};


export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Digital Library — Shiksha Sahaya" },
      { name: "description", content: "Free PDFs and videos for Karnataka government school students, organised by class, subject and topic." },
      { property: "og:title", content: "Digital Library — Shiksha Sahaya" },
      { property: "og:description", content: "Searchable study material by class, subject and topic." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [classLevel, setClassLevel] = useState("all");
  const [subject, setSubject] = useState("all");
  const [active, setActive] = useState<LibraryItem | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["library"],
    queryFn: async () => {
      const { data } = await supabase.from("library_items").select("*").order("class_level").order("subject");
      return data ?? [];
    },
  });

  const items = data ?? [];
  const classes = [...new Set(items.map((i) => String(i.class_level)))].sort();
  const subjects = [...new Set(items.map((i) => i.subject))].sort();

  const filtered = items.filter(
    (i) =>
      (classLevel === "all" || String(i.class_level) === classLevel) &&
      (subject === "all" || i.subject === subject) &&
      (q.trim() === "" ||
        `${i.title} ${i.topic} ${i.description}`.toLowerCase().includes(q.trim().toLowerCase())),
  );

  return (
    <div className="gov-container py-10">
      <h1 className="text-2xl font-bold text-foreground">{t("lib.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("lib.sub")}</p>

      <div className="mt-6 grid gap-4 rounded-md border border-border bg-card p-5 shadow-card sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="q">{t("lib.search")}</Label>
          <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="class">{t("lib.class")}</Label>
          <select
            id="class"
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">{t("off.all")}</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">{t("lib.subject")}</Label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">{t("off.all")}</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">{t("lib.none")}</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const Icon = item.media_type === "video" ? PlayCircle : FileText;
            return (
              <li key={item.id} className="gov-panel gov-panel-hover flex flex-col p-5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Icon aria-hidden="true" className="size-4 text-success" />
                  {t(item.media_type === "video" ? "lib.video" : "lib.pdf")} · {t("lib.class")} {item.class_level} · {item.subject}
                </div>
                <h2 className="mt-2 text-sm font-semibold text-foreground">{item.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{item.topic}</p>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => setActive(item as LibraryItem)}>
                    {t(item.media_type === "video" ? "lib.watch" : "lib.read")}
                  </Button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-2 hover:underline"
                  >
                    <ExternalLink aria-hidden="true" className="size-3.5" /> {t("lib.newTab")}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{active?.title}</DialogTitle>
            <DialogDescription>
              {active ? `${t("lib.class")} ${active.class_level} · ${active.subject} · ${active.topic}` : null}
            </DialogDescription>
          </DialogHeader>
          {active && (
            <>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-md border border-border bg-muted sm:aspect-video">
                <iframe
                  key={active.id}
                  src={active.url}
                  title={active.title}
                  className="size-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-xs text-muted-foreground">{t("lib.viewerNote")}</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={active.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink aria-hidden="true" /> {t("lib.newTab")}
                  </a>
                </Button>
                {active.media_type !== "video" && (
                  <Button asChild size="sm" variant="outline">
                    <a href={active.url} download target="_blank" rel="noopener noreferrer">
                      <Download aria-hidden="true" /> {t("lib.download")}
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
