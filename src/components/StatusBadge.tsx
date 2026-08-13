import { useI18n } from "@/lib/i18n";

export type ComplaintStatus = "submitted" | "under_review" | "resolved";

const styles: Record<ComplaintStatus, string> = {
  submitted: "bg-secondary text-secondary-foreground",
  under_review: "bg-saffron-soft text-warning",
  resolved: "bg-success-soft text-success",
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const { t } = useI18n();
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium ${styles[status]}`}>
      {t(`status.${status}`)}
    </span>
  );
}

export function StatusTimeline({ status }: { status: ComplaintStatus }) {
  const { t } = useI18n();
  const steps: ComplaintStatus[] = ["submitted", "under_review", "resolved"];
  const current = steps.indexOf(status);
  return (
    <ol className="flex items-center gap-2" aria-label="Status timeline">
      {steps.map((step, i) => (
        <li key={step} className="flex flex-1 items-center gap-2">
          <span
            className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              i <= current ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {i + 1}
          </span>
          <span className={`text-xs ${i <= current ? "text-foreground" : "text-muted-foreground"}`}>{t(`status.${step}`)}</span>
          {i < steps.length - 1 && (
            <span className={`hidden h-px flex-1 sm:block ${i < current ? "bg-success" : "bg-border"}`} />
          )}
        </li>
      ))}
    </ol>
  );
}
