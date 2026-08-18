import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t border-border bg-primary text-primary-foreground">
      <div className="gov-container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h2 className="text-sm font-semibold">{t("site.name")}</h2>
          <p className="mt-2 text-xs leading-relaxed text-primary-foreground/75">{t("site.tagline")}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">{t("footer.contact")}</h2>
          <ul className="mt-2 space-y-1 text-xs text-primary-foreground/75">
            <li>{t("footer.helpline")}: 1800-425-0000</li>
            <li>shikshasahaya@karnataka.gov.in</li>
            <li>Department of School Education, Bengaluru 560001</li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">{t("footer.accessibility")}</h2>
          <ul className="mt-2 space-y-1 text-xs text-primary-foreground/75">
            <li>{t("footer.rti")}</li>
            <li>WCAG AA contrast · Screen-reader friendly</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <p className="gov-container py-4 text-xs leading-relaxed text-primary-foreground/70">
          {t("footer.disclaimer")}
        </p>
      </div>
    </footer>
  );
}
