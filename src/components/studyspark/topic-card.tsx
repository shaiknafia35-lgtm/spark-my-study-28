import { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { explainTopicFn } from "@/lib/studyspark.functions";
import type { PdfPage, Topic } from "@/lib/studyspark-types";

const priorityMeta = {
  high: { dot: "🔴", label: "High Priority", cls: "bg-danger/12 text-danger border-danger/30" },
  medium: {
    dot: "🟡",
    label: "Medium Priority",
    cls: "bg-warning/15 text-warning border-warning/30",
  },
  low: { dot: "🟢", label: "Low Priority", cls: "bg-success/12 text-success border-success/30" },
} as const;

export function TopicCard({
  topic,
  pages,
  bookmarked,
  onToggleBookmark,
}: {
  topic: Topic;
  pages: PdfPage[];
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const meta = priorityMeta[topic.priority] ?? priorityMeta.medium;

  async function explain(beginner: boolean) {
    setLoading(true);
    try {
      const res = await explainTopicFn({
        data: { pages, topic: topic.name, beginner },
      });
      if (res.ok) {
        setExplanation(res.text);
      } else {
        setExplanation(
          `${topic.explanation}\n\n${topic.keyPoints.map((k) => `- ${k}`).join("\n")}`,
        );
        toast.warning("Showing the offline explanation", {
          description: "The AI service isn't available right now.",
        });
      }
    } catch {
      toast.error("Network problem", { description: "Please check your connection and retry." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="surface-card animate-rise flex flex-col rounded-2xl border border-border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="outline" className={`mb-2 rounded-full ${meta.cls}`}>
            {meta.dot} {meta.label} based on the uploaded material
          </Badge>
          <h3 className="text-lg font-semibold leading-snug">{topic.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Bookmark topic"
          onClick={() => onToggleBookmark(topic.id)}
        >
          {bookmarked ? (
            <BookmarkCheck className="size-4 text-spark" />
          ) : (
            <Bookmark className="size-4" />
          )}
        </Button>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{topic.why}</p>
      <p className="mt-3 text-sm leading-relaxed">{topic.explanation}</p>

      {topic.keyPoints?.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm">
          {topic.keyPoints.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      {topic.definition && (
        <p className="mt-3 rounded-xl border border-border bg-secondary/60 p-3 text-sm">
          <span className="font-semibold">Definition: </span>
          {topic.definition}
        </p>
      )}
      {topic.formula && (
        <p className="mt-2 rounded-xl border border-primary/25 bg-primary/8 p-3 font-mono text-sm">
          {topic.formula}
        </p>
      )}
      {topic.example && (
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Example: </span>
          {topic.example}
        </p>
      )}

      {explanation && (
        <div className="mt-4 rounded-xl border border-border bg-background/70 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" /> StudySpark explanation
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Copy explanation"
                onClick={() => {
                  navigator.clipboard.writeText(explanation);
                  toast.success("Copied to clipboard");
                }}
              >
                <Copy className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Regenerate explanation"
                onClick={() => explain(false)}
              >
                <RefreshCw className="size-3.5" />
              </Button>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{explanation}</p>
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <Button size="sm" disabled={loading} onClick={() => explain(false)}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          Explain Simply
        </Button>
        <Button size="sm" variant="outline" disabled={loading} onClick={() => explain(true)}>
          Explain Like I&apos;m a Beginner
        </Button>
        {topic.page ? (
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <FileText className="size-3.5" /> Page {topic.page}
          </span>
        ) : null}
      </div>
    </article>
  );
}
