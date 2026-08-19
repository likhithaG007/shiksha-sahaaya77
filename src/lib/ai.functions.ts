import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  lang: z.enum(["en", "kn"]),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false as const, reply: "AI assistant is not configured." };

    const system =
      "You are the Shiksha Sahaya assistant for Karnataka government school students, parents and teachers. " +
      "Answer every question the user asks — school subjects, general knowledge, exams, careers, health, government schemes, " +
      "technology, daily life or anything else — clearly, accurately and helpfully. Never refuse a reasonable question. " +
      "Only decline content that is unsafe, illegal or explicit. " +
      "Keep answers simple and step-by-step, using short paragraphs or numbered points. " +
      (data.lang === "kn"
        ? "Reply in Kannada unless the student writes in English."
        : "Reply in English unless the student writes in Kannada.") +
      " For school topics, remind students to confirm important answers with their teacher.";

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });


    if (!res.ok) {
      if (res.status === 429) return { ok: false as const, reply: "Too many requests right now. Please try again shortly." };
      if (res.status === 402) return { ok: false as const, reply: "AI credits exhausted. Please try again later." };
      return { ok: false as const, reply: "The assistant could not answer just now. Please try again." };
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { ok: true as const, reply: json.choices?.[0]?.message?.content ?? "" };
  });
