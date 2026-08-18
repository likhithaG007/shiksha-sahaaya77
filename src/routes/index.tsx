import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Search, BookOpen, Bot, ShieldCheck, Languages, Ticket } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shiksha Sahaya — School Grievance & Learning Portal" },
      {
        name: "description",
        content:
          "Bilingual Karnataka government school portal: report school problems with ticket tracking, view attendance and results, and study free digital material.",
      },
      { property: "og:title", content: "Shiksha Sahaya — School Grievance & Learning Portal" },
      {
        property: "og:description",
        content: "Report school problems, track every ticket, and keep learning — in Kannada and English.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();

  const quick = [
    { to: "/submit", icon: FileText, key: "nav.submit" },
    { to: "/track", icon: Search, key: "nav.track" },
    { to: "/library", icon: BookOpen, key: "nav.library" },
    { to: "/assistant", icon: Bot, key: "nav.assistant" },
  ] as const;

  const stats = [
    { icon: Languages, k: "home.stats.a" },
    { icon: Ticket, k: "home.stats.b" },
    { icon: ShieldCheck, k: "home.stats.c" },
  ] as const;

  return (
    <div>
      <section className="border-b border-border bg-card">
        <div className="gov-container grid gap-8 py-12 md:grid-cols-[3fr_2fr] md:items-center">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
              {t("home.hero.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {t("home.hero.sub")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-saffron text-saffron-foreground hover:bg-saffron/90">
                <Link to="/submit">{t("home.cta.submit")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/track">{t("home.cta.track")}</Link>
              </Button>
            </div>
          </div>
          <ul className="grid gap-3">
            {stats.map(({ icon: Icon, k }) => (
              <li key={k} className="flex items-start gap-3 rounded-md border border-border bg-background p-4 shadow-card">
                <Icon aria-hidden="true" className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t(k)}</p>
                  <p className="text-xs text-muted-foreground">{t(`${k}.d`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gov-container py-12">
        <h2 className="text-xl font-semibold text-foreground">{t("home.quick")}</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quick.map(({ to, icon: Icon, key }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex h-full flex-col gap-2 rounded-md border border-border bg-card p-5 shadow-card transition-colors hover:border-primary"
              >
                <Icon aria-hidden="true" className="size-6 text-primary" />
                <span className="text-sm font-semibold text-foreground">{t(key)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-card">
        <div className="gov-container py-12">
          <h2 className="text-xl font-semibold text-foreground">{t("home.how")}</h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            {["1", "2", "3"].map((n) => (
              <li key={n} className="rounded-md border border-border bg-background p-5 shadow-card">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {n}
                </span>
                <h3 className="mt-3 text-base font-semibold text-foreground">{t(`home.how.${n}`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`home.how.${n}.d`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
