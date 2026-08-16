import { useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askStudySpark } from "@/lib/studyspark.functions";
import type { PdfPage } from "@/lib/studyspark-types";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What are the most important topics?",
  "Give me 10 important questions.",
  "Give me a quick revision.",
  "Explain page 3.",
];

export function ChatPanel({ pages }: { pages: PdfPage[] }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm StudySpark AI. Ask me anything about your uploaded PDF — topics, definitions, formulas, or a quick revision.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    const history = messages.filter((m) => m.role !== "assistant" || messages.indexOf(m) > 0);
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await askStudySpark({ data: { pages, history, question } });
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: res.ok
            ? res.text
            : "I can't reach the AI service right now. Please try again in a moment — your PDF is still saved.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network problem — please check your connection and retry." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="surface-card flex h-[560px] flex-col rounded-2xl border border-border">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <Sparkles className="size-4 text-primary" />
        <h3 className="font-semibold">Ask StudySpark AI</h3>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" /> StudySpark is reading your
            PDF…
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your PDF…"
          />
          <Button type="submit" size="icon" disabled={loading} aria-label="Send question">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
