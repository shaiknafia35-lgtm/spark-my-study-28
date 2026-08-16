import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  Copy,
  Download,
  FileText,
  HelpCircle,
  Search,
  Sigma,
  Sparkles,
  StickyNote,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteNav } from "@/components/studyspark/nav";
import { TopicCard } from "@/components/studyspark/topic-card";
import { ChatPanel } from "@/components/studyspark/chat-panel";
import {
  clearCurrentDoc,
  downloadText,
  getBookmarks,
  getCurrentDoc,
  toggleBookmark,
} from "@/lib/studyspark-store";
import type { AnalyzedDoc } from "@/lib/studyspark-types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "StudySpark Dashboard — Your PDF, Analyzed" },
      {
        name: "description",
        content:
          "Important topics, quick notes, definitions, formulas, questions and flashcards generated from your uploaded study PDF.",
      },
      { property: "og:title", content: "StudySpark Dashboard — Your PDF, Analyzed" },
      {
        property: "og:description",
        content: "Topics, notes, definitions, formulas, questions and flashcards from your PDF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function StatCard({ icon, label, value }: { icon: string; label: string; value: number | string }) {
  return (
    <div className="surface-card rounded-2xl border border-border p-5">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function Dashboard() {
  const [doc, setDoc] = useState<AnalyzedDoc | null | undefined>(undefined);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setDoc(getCurrentDoc());
    setBookmarks(getBookmarks());
  }, []);

  const analysis = doc?.analysis;

  const searchResults = useMemo(() => {
    if (!doc || query.trim().length < 2) return null;
    const q = query.toLowerCase();
    const hits: { kind: string; text: string; page?: number | undefined }[] = [];
    for (const t of doc.analysis.topics) {
      if ((t.name + t.explanation + t.keyPoints.join(" ")).toLowerCase().includes(q))
        hits.push({ kind: "Topic", text: t.name, page: t.page });
    }
    for (const d of doc.analysis.definitions) {
      if ((d.term + d.meaning).toLowerCase().includes(q))
        hits.push({ kind: "Definition", text: `${d.term} — ${d.meaning}`, page: d.page });
    }
    for (const f of doc.analysis.formulas) {
      if ((f.expression + f.meaning).toLowerCase().includes(q))
        hits.push({ kind: "Formula", text: `${f.expression} — ${f.meaning}`, page: f.page });
    }
    for (const list of [
      doc.analysis.questions.short,
      doc.analysis.questions.long,
      doc.analysis.questions.conceptual,
    ]) {
      for (const qu of list)
        if (qu.toLowerCase().includes(q)) hits.push({ kind: "Question", text: qu });
    }
    for (const p of doc.pages) {
      if (p.text.toLowerCase().includes(q)) {
        const idx = p.text.toLowerCase().indexOf(q);
        hits.push({
          kind: "In PDF",
          text: `…${p.text.slice(Math.max(0, idx - 60), idx + 100)}…`,
          page: p.page,
        });
      }
    }
    return hits.slice(0, 20);
  }, [doc, query]);

  if (doc === undefined) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>
    );
  }

  if (!doc || !analysis) {
    return (
      <div className="min-h-screen">
        <SiteNav dashboard />
        <div className="mx-auto max-w-md px-4 py-32 text-center">
          <h1 className="text-2xl font-semibold">No PDF analyzed yet</h1>
          <p className="mt-2 text-muted-foreground">
            Upload a study PDF and StudySpark will find what matters.
          </p>
          <Button asChild className="mt-6 bg-gradient-spark text-primary-foreground">
            <Link to="/">Upload a PDF</Link>
          </Button>
        </div>
      </div>
    );
  }

  const notesText = [
    `StudySpark Notes — ${analysis.title}`,
    "",
    ...analysis.notes.flatMap((n) => [n.heading, ...n.points.map((p) => `- ${p}`), ""]),
    "Quick Revision",
    ...analysis.quickRevision.map((r) => `- ${r}`),
  ].join("\n");

  const questionCount =
    analysis.questions.short.length +
    analysis.questions.long.length +
    analysis.questions.conceptual.length +
    analysis.questions.mcq.length;

  return (
    <div className="min-h-screen">
      <SiteNav dashboard />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">StudySpark</p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
              Your PDF has been analyzed! 🔥
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <FileText className="size-4" /> {doc.fileName}
              {doc.demo && (
                <Badge variant="outline" className="border-spark/40 bg-spark/15 text-spark-foreground">
                  Demo Mode
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                clearCurrentDoc();
                setDoc(null);
                toast.success("PDF cleared");
              }}
            >
              <Trash2 className="size-4" /> Clear PDF
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon="📄" label="Pages Analyzed" value={doc.pageCount} />
          <StatCard icon="⭐" label="Important Topics" value={analysis.topics.length} />
          <StatCard icon="📝" label="Key Notes" value={analysis.notes.length} />
          <StatCard icon="❓" label="Questions Generated" value={questionCount} />
        </div>

        <div className="relative mt-8">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, definitions, keywords, questions…"
            className="h-12 rounded-xl pl-11"
          />
          {searchResults && (
            <div className="surface-card mt-3 max-h-80 space-y-2 overflow-y-auto rounded-2xl border border-border p-3">
              {searchResults.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground">
                  Nothing matched “{query}” in this PDF.
                </p>
              ) : (
                searchResults.map((r, i) => (
                  <div key={i} className="rounded-xl border border-border/60 p-3 text-sm">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-full text-[11px]">
                        {r.kind}
                      </Badge>
                      {r.page ? (
                        <span className="text-xs text-muted-foreground">Page {r.page}</span>
                      ) : null}
                    </div>
                    <p className="text-muted-foreground">{r.text}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <Tabs defaultValue="topics" className="mt-8">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-xl p-1.5">
            <TabsTrigger value="topics" className="rounded-lg">
              <Sparkles className="size-4" /> Important Topics
            </TabsTrigger>
            <TabsTrigger value="notes" className="rounded-lg">
              <StickyNote className="size-4" /> Quick Notes
            </TabsTrigger>
            <TabsTrigger value="definitions" className="rounded-lg">
              <BookOpen className="size-4" /> Key Definitions
            </TabsTrigger>
            <TabsTrigger value="formulas" className="rounded-lg">
              <Sigma className="size-4" /> Formulas
            </TabsTrigger>
            <TabsTrigger value="questions" className="rounded-lg">
              <HelpCircle className="size-4" /> Questions
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="rounded-lg">
              <Brain className="size-4" /> Flashcards
            </TabsTrigger>
            <TabsTrigger value="revision" className="rounded-lg">
              <Zap className="size-4" /> Quick Revision
            </TabsTrigger>
            <TabsTrigger value="ask" className="rounded-lg">
              <Sparkles className="size-4" /> Ask AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="topics" className="mt-6">
            <div className="grid gap-5 lg:grid-cols-2">
              {analysis.topics.map((t) => (
                <TopicCard
                  key={t.id}
                  topic={t}
                  pages={doc.pages}
                  bookmarked={bookmarks.includes(t.id)}
                  onToggleBookmark={(id) => setBookmarks(toggleBookmark(id))}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <div className="mb-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(notesText);
                  toast.success("Notes copied");
                }}
              >
                <Copy className="size-4" /> Copy notes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadText("studyspark-notes.txt", notesText)}
              >
                <Download className="size-4" /> Download notes
              </Button>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {analysis.notes.map((n) => (
                <div key={n.heading} className="surface-card rounded-2xl border border-border p-5">
                  <h3 className="font-semibold">{n.heading}</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {n.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-spark" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="definitions" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {analysis.definitions.map((d) => (
                <div key={d.term} className="surface-card rounded-2xl border border-border p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{d.term}</h3>
                    {d.page ? (
                      <span className="text-xs text-muted-foreground">Page {d.page}</span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{d.meaning}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {analysis.formulas.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No formulas were found in the uploaded material.
                </p>
              )}
              {analysis.formulas.map((f) => (
                <div key={f.expression} className="surface-card rounded-2xl border border-border p-5">
                  <p className="rounded-xl border border-primary/25 bg-primary/8 p-3 text-center font-mono text-base">
                    {f.expression}
                  </p>
                  <p className="mt-3 text-sm">{f.meaning}</p>
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    {f.symbols.map((s) => (
                      <li key={s.symbol}>
                        <span className="font-mono font-semibold text-foreground">{s.symbol}</span>{" "}
                        — {s.meaning}
                      </li>
                    ))}
                  </ul>
                  {f.page ? (
                    <p className="mt-3 text-xs text-muted-foreground">Page {f.page}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            <div className="grid gap-5 md:grid-cols-2">
              {[
                { title: "Short-answer questions", items: analysis.questions.short },
                { title: "Long-answer questions", items: analysis.questions.long },
                { title: "Conceptual questions", items: analysis.questions.conceptual },
              ].map((group) => (
                <div key={group.title} className="surface-card rounded-2xl border border-border p-5">
                  <h3 className="font-semibold">{group.title}</h3>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
                    {group.items.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ol>
                </div>
              ))}
              <div className="surface-card rounded-2xl border border-border p-5">
                <h3 className="font-semibold">Multiple-choice questions</h3>
                <div className="mt-3 space-y-4 text-sm">
                  {analysis.questions.mcq.map((m) => (
                    <div key={m.question}>
                      <p className="font-medium">{m.question}</p>
                      <ul className="mt-1 space-y-1 text-muted-foreground">
                        {m.options.map((o) => (
                          <li key={o} className={o === m.answer ? "font-medium text-success" : ""}>
                            • {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="flashcards" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {analysis.flashcards.map((c) => (
                <Flashcard key={c.question} question={c.question} answer={c.answer} page={c.page} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="revision" className="mt-6">
            <div className="surface-card rounded-2xl border border-border p-6">
              <h3 className="text-xl font-semibold">⚡ Quick Revision</h3>
              <p className="mt-2 text-sm text-muted-foreground">{analysis.summary}</p>
              <ul className="mt-4 space-y-3">
                {analysis.quickRevision.map((r) => (
                  <li key={r} className="flex gap-3 text-sm">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-gradient-spark" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(analysis.quickRevision.join("\n"));
                    toast.success("Revision copied");
                  }}
                >
                  <Copy className="size-4" /> Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    downloadText("studyspark-quick-revision.txt", analysis.quickRevision.join("\n"))
                  }
                >
                  <Download className="size-4" /> Download
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ask" className="mt-6">
            <ChatPanel pages={doc.pages} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Flashcard({
  question,
  answer,
  page,
}: {
  question: string;
  answer: string;
  page?: number | undefined;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="surface-card min-h-36 rounded-2xl border border-border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
        {flipped ? "Answer" : "Question"}
      </span>
      <p className="mt-2 text-sm font-medium">{flipped ? answer : question}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        {page ? `Page ${page} · ` : ""}Tap to flip
      </p>
    </button>
  );
}
