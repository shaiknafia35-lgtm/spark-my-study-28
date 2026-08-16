import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  BookOpen,
  Clock,
  FileSearch,
  HelpCircle,
  Sigma,
  Sparkles,
  StickyNote,
  UploadCloud,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/studyspark/nav";
import { UploadZone } from "@/components/studyspark/upload-zone";
import { getRecentDocs, type RecentDoc } from "@/lib/studyspark-store";
import { formatBytes } from "@/lib/pdf-extract";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudySpark — Turn Your PDFs Into Smarter Study" },
      {
        name: "description",
        content:
          "Upload a study PDF and StudySpark finds the important topics, simplifies concepts, and generates notes, questions and flashcards for faster revision.",
      },
      { property: "og:title", content: "StudySpark — Turn Your PDFs Into Smarter Study" },
      {
        property: "og:description",
        content:
          "AI study assistant for college students: important topics, simple explanations, notes, questions and flashcards from any PDF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const STEPS = [
  { icon: UploadCloud, title: "Upload PDF", text: "Drop in lecture notes, a unit PDF or a full textbook chapter." },
  { icon: FileSearch, title: "AI Analyzes", text: "StudySpark reads every page and maps headings, terms and formulas." },
  { icon: Sparkles, title: "Important Topics", text: "Concepts are ranked High, Medium or Low based on your material." },
  { icon: Brain, title: "Simple Explanations", text: "Any topic explained in plain English — or beginner mode." },
  { icon: HelpCircle, title: "Questions", text: "Short, long, conceptual and MCQ practice generated from the PDF." },
  { icon: Zap, title: "Quick Revision", text: "A tight summary you can read right before you study." },
];

const FEATURES = [
  { icon: Sparkles, title: "Important Topics", text: "Priority-ranked topic cards with page references." },
  { icon: StickyNote, title: "Quick Notes", text: "Short revision notes you can copy or download." },
  { icon: BookOpen, title: "Key Definitions", text: "Every important term pulled straight from your PDF." },
  { icon: Sigma, title: "Important Formulas", text: "Formulas with each symbol explained clearly." },
  { icon: HelpCircle, title: "Important Questions", text: "Short, long, conceptual and multiple-choice sets." },
  { icon: Brain, title: "Flashcards", text: "Flip cards for fast active recall before exams." },
];

function Home() {
  const [recent, setRecent] = useState<RecentDoc[]>([]);
  useEffect(() => setRecent(getRecentDocs()), []);

  return (
    <div className="min-h-screen">
      <SiteNav />

      <main id="home">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 size-[720px] -translate-x-1/2 rounded-full opacity-25 blur-3xl bg-gradient-spark"
          />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
            <div className="animate-rise">
              <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">
                <Sparkles className="size-3.5" /> AI study assistant for college students
              </Badge>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                Turn Your PDFs Into <span className="text-gradient">Smarter Study.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                Upload your study material and let StudySpark find the important topics, simplify
                difficult concepts, and help you revise faster.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gradient-spark text-primary-foreground">
                  <a href="#upload">
                    <UploadCloud className="size-5" /> Upload PDF
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#how-it-works">See how it works</a>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Find What Matters. Learn What Matters.
              </p>
            </div>

            <div className="animate-rise">
              <UploadZone />
            </div>
          </div>
        </section>

        {/* Recent */}
        {recent.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Clock className="size-4" /> Recently analyzed
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((r) => (
                <Link
                  key={r.id}
                  to="/dashboard"
                  className="surface-card rounded-2xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <p className="truncate font-medium">{r.fileName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.pageCount} pages · {r.topics} topics · {formatBytes(r.fileSize)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 bg-secondary/40 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold sm:text-4xl">How StudySpark works</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Six steps between a 90-page PDF and a confident revision session.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {STEPS.map((s, i) => (
                <div key={s.title} className="surface-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <s.icon className="size-5" />
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold sm:text-4xl">Everything in one study workspace</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Each tool works from your uploaded document — with page references, so you can always
              check the source.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="surface-card rounded-2xl border border-border p-6 transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="bg-gradient-spark grid size-11 place-items-center rounded-xl text-primary-foreground">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-20 pb-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="surface-card rounded-3xl border border-border p-8 sm:p-12">
              <h2 className="text-3xl font-bold">About StudySpark</h2>
              <p className="mt-4 text-muted-foreground">
                Lecturers share long PDFs. Students have limited hours. StudySpark closes that gap:
                it reads your material, highlights what carries the most weight in the document, and
                explains it in language a beginner can follow. Every result stays grounded in the
                file you uploaded — if something isn&apos;t in your PDF, StudySpark says so instead
                of inventing it.
              </p>
              <p className="mt-4 text-muted-foreground">
                Priorities describe emphasis inside your material, not exam predictions. No AI key
                configured? Demo Mode keeps the full experience explorable with a sample study PDF.
              </p>
              <Button asChild className="mt-6 bg-gradient-spark text-primary-foreground">
                <a href="#upload">Start with your PDF</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground sm:px-6">
          <span className="font-display font-semibold text-foreground">StudySpark</span>
          <span>Find What Matters. Learn What Matters.</span>
        </div>
      </footer>
    </div>
  );
}
