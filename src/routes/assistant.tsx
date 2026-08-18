import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Info } from "lucide-react";
import { askAssistant } from "@/lib/ai.functions";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Learning Assistant — School Samadhana" },
      { name: "description", content: "Bilingual homework and concept help for Karnataka government school students in Kannada and English." },
      { property: "og:title", content: "AI Learning Assistant — School Samadhana" },
      { property: "og:description", content: "Ask academic doubts in Kannada or English and get simple step-by-step answers." },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  const { t, lang } = useI18n();
  const ask = useServerFn(askAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await ask({ data: { lang, messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: t("common.error") }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="gov-container max-w-3xl py-10">
      <h1 className="text-2xl font-bold text-foreground">{t("ai.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("ai.sub")}</p>

      <p className="mt-4 flex items-start gap-2 rounded-md border border-border bg-saffron-soft p-3 text-xs text-foreground">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
        {t("ai.disclaimer")}
      </p>

      <div className="mt-6 min-h-64 space-y-3 rounded-md border border-border bg-card p-5 shadow-card">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("ai.empty")}</p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] whitespace-pre-wrap rounded-md px-3 py-2 text-sm ${
                m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-background text-foreground"
              }`}
            >
              {m.content}
            </div>
          ))
        )}
        {busy && <p className="text-sm text-muted-foreground">{t("ai.thinking")}</p>}
      </div>

      <form onSubmit={send} className="mt-4 flex items-end gap-3">
        <Textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("ai.placeholder")}
          aria-label={t("ai.placeholder")}
        />
        <Button type="submit" disabled={busy}>
          {t("ai.send")}
        </Button>
      </form>
    </div>
  );
}
