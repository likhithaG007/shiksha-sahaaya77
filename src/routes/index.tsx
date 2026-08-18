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
      <section className="gov-hero border-b border-border">
        <div className="gov-container grid gap-8 py-12 md:grid-cols-[3fr_2fr] md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              <ShieldCheck aria-hidden="true" className="size-3.5" /> {t("site.tagline")}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              {t("home.hero.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/85">
              {t("home.hero.sub")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-saffron text-saffron-foreground hover:bg-saffron/90">
                <Link to="/submit">{t("home.cta.submit")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/track">{t("home.cta.track")}</Link>
              </Button>
            </div>
          </div>
          <ul className="grid gap-3">
            {stats.map(({ icon: Icon, k }) => (
              <li key={k} className="flex items-start gap-3 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur-sm">
                <Icon aria-hidden="true" className="mt-0.5 size-5 text-saffron" />
                <div>
                  <p className="text-sm font-semibold">{t(k)}</p>
                  <p className="text-xs text-primary-foreground/75">{t(`${k}.d`)}</p>
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
                className="gov-panel gov-panel-hover flex h-full flex-col gap-2 p-5"
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
              <li key={n} className="gov-panel gov-panel-hover bg-background p-5">
                <span className="flex size-9 items-center justify-center rounded-full bg-saffron text-sm font-bold text-saffron-foreground shadow-card">
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
