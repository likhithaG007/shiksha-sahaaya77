import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", key: "nav.home" },
  { to: "/dashboard", key: "nav.dashboard" },
  { to: "/library", key: "nav.library" },
  { to: "/assistant", key: "nav.assistant" },
  { to: "/submit", key: "nav.submit" },
  { to: "/track", key: "nav.track" },
] as const;

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const { session, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const items = role === "official" ? [...navItems, { to: "/officials", key: "nav.officials" } as const] : navItems;

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground">
        <div className="gov-container flex flex-wrap items-center gap-3 py-2">
          <div
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-primary-foreground/30 bg-primary-foreground/10 text-xs font-bold"
          >
            ಕ
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{t("site.name")}</p>
            <p className="truncate text-xs text-primary-foreground/75">{t("site.tagline")}</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              role="group"
              aria-label="Language"
              className="flex overflow-hidden rounded-sm border border-primary-foreground/30 text-xs"
            >
              <button
                type="button"
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                className={`px-2 py-1 ${lang === "en" ? "bg-primary-foreground text-primary" : "hover:bg-primary-foreground/10"}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang("kn")}
                aria-pressed={lang === "kn"}
                className={`px-2 py-1 ${lang === "kn" ? "bg-primary-foreground text-primary" : "hover:bg-primary-foreground/10"}`}
              >
                ಕನ್ನಡ
              </button>
            </div>
            {session ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/", replace: true });
                }}
              >
                <LogOut aria-hidden="true" /> {t("nav.logout")}
              </Button>
            ) : (
              <Button size="sm" variant="secondary" asChild>
                <Link to="/auth">
                  <LogIn aria-hidden="true" /> {t("nav.login")}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <nav aria-label="Primary" className="border-b border-border bg-card shadow-card">
        <div className="gov-container flex items-center justify-between">
          <ul className="hidden gap-1 md:flex">
            {items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "border-saffron text-primary" }}
                  inactiveProps={{ className: "border-transparent text-muted-foreground" }}
                  className="inline-block border-b-2 px-3 py-3 text-sm font-medium transition-colors hover:text-primary"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="inline-flex items-center gap-2 py-3 text-sm font-medium text-primary md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
            {t("nav.menu")}
          </button>
          {role && (
            <span className="hidden items-center gap-1 text-xs text-muted-foreground md:inline-flex">
              <ShieldCheck aria-hidden="true" size={14} className="text-success" />
              {t(`auth.role.${role}`)}
            </span>
          )}
        </div>
        {open && (
          <ul className="gov-container flex flex-col pb-2 md:hidden">
            {items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border py-3 text-sm font-medium text-foreground"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
