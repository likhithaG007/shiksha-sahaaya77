import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { StatusBadge, type ComplaintStatus } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — School Samadhana" },
      { name: "description", content: "Attendance, subject results and complaint status for students and their parents." },
      { property: "og:title", content: "Dashboard — School Samadhana" },
      { property: "og:description", content: "Private attendance, results and grievance status, visible only after login." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useI18n();
  const { session, role, loading } = useAuth();
  const userId = session?.user.id;

  const { data, isLoading } = useQuery({
    enabled: !!userId,
    queryKey: ["dashboard", userId],
    queryFn: async () => {
      const [own, linked] = await Promise.all([
        supabase.from("students").select("*").eq("user_id", userId!).maybeSingle(),
        supabase.from("parent_links").select("students(*)").eq("parent_user_id", userId!).limit(1),
      ]);
      const student = own.data ?? linked.data?.[0]?.students ?? null;
      if (!student) return { student: null, attendance: [], results: [], complaints: [] };

      const [attendance, results, complaints] = await Promise.all([
        supabase.from("attendance").select("*").eq("student_id", student.id).order("month"),
        supabase.from("results").select("*").eq("student_id", student.id).order("subject"),
        supabase.from("complaints").select("*").eq("created_by", userId!).order("created_at", { ascending: false }),
      ]);
      return {
        student,
        attendance: attendance.data ?? [],
        results: results.data ?? [],
        complaints: complaints.data ?? [],
      };
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

  if (isLoading || !data) return <p className="gov-container py-12 text-sm text-muted-foreground">{t("common.loading")}</p>;

  if (!data.student) {
    return (
      <div className="gov-container py-16">
        <h1 className="text-2xl font-bold text-foreground">{t(role === "parent" ? "dash.parent" : "dash.student")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t("dash.nolink")}</p>
      </div>
    );
  }

  const totalPresent = data.attendance.reduce((s, a) => s + a.present_days, 0);
  const totalDays = data.attendance.reduce((s, a) => s + a.total_days, 0);
  const attendancePct = totalDays ? Math.round((totalPresent / totalDays) * 100) : 0;
  const avgMarks = data.results.length
    ? Math.round(data.results.reduce((s, r) => s + (r.marks / r.max_marks) * 100, 0) / data.results.length)
    : 0;

  return (
    <div className="gov-container space-y-8 py-10">
      <header>
        <h1 className="text-2xl font-bold text-foreground">{t(role === "parent" ? "dash.parent" : "dash.student")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {data.student.full_name} · {t("dash.roll")}: {data.student.roll_number} · {t("dash.class")} {data.student.class_level} ·{" "}
          {t("dash.school")}: {data.student.school_name}
        </p>
        {role === "parent" && (
          <Button asChild className="mt-4 bg-saffron text-saffron-foreground hover:bg-saffron/90">
            <Link to="/submit">{t("dash.onBehalf")}</Link>
          </Button>
        )}
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t("dash.attendance")} value={`${attendancePct}%`} sub={t("dash.attendance.sub")} />
        <StatCard label={t("dash.average")} value={`${avgMarks}%`} sub={t("dash.results")} />
        <StatCard label={t("dash.subjects")} value={String(data.results.length)} sub={t("dash.results")} />
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-5 shadow-card">
          <h2 className="text-base font-semibold text-foreground">{t("dash.results")}</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.results.map((r) => ({ subject: r.subject, marks: Math.round((r.marks / r.max_marks) * 100) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="subject" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip />
                <Bar dataKey="marks" fill="var(--color-primary)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-md border border-border bg-card p-5 shadow-card">
          <h2 className="text-base font-semibold text-foreground">{t("dash.progress")}</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.attendance.map((a) => ({
                  month: a.month,
                  pct: a.total_days ? Math.round((a.present_days / a.total_days) * 100) : 0,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="pct" stroke="var(--color-success)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-foreground">{t("dash.complaints")}</h2>
        {data.complaints.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{t("dash.none")}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {data.complaints.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-4 shadow-card">
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.ticket_id}</p>
                  <p className="text-xs text-muted-foreground">
                    {t(`cat.${c.category}`)} · {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={c.status as ComplaintStatus} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
