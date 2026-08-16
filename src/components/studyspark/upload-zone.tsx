import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Loader2, Trash2, UploadCloud, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { extractPdfPages, formatBytes, FriendlyError } from "@/lib/pdf-extract";
import { analyzePdf } from "@/lib/studyspark.functions";
import { buildDemoDoc, DEMO_ANALYSIS, DEMO_PAGES } from "@/lib/studyspark-demo";
import { saveCurrentDoc } from "@/lib/studyspark-store";
import type { AnalyzedDoc } from "@/lib/studyspark-types";

type Stage = "idle" | "reading" | "analyzing";

const FRIENDLY_REASONS: Record<string, string> = {
  "no-key": "AI isn't connected yet — showing Demo Mode results instead.",
  network: "We couldn't reach the AI service. Showing Demo Mode results instead.",
  "rate-limited": "The AI is busy right now. Please try again in a moment.",
  credits: "AI credits are exhausted. Add credits to keep analyzing real PDFs.",
};

export function UploadZone() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);

  const busy = stage !== "idle";

  function pick(selected: File | undefined | null) {
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".pdf")) {
      toast.error("That's not a PDF", {
        description: "StudySpark reads .pdf study material. Please choose a PDF file.",
      });
      return;
    }
    setFile(selected);
    setProgress(0);
  }

  async function analyze() {
    if (!file) return;
    try {
      setStage("reading");
      setProgress(5);
      const pages = await extractPdfPages(file, (p) => setProgress(Math.round(p * 0.6)));

      setStage("analyzing");
      setProgress(70);
      const result = await analyzePdf({ data: { pages } });
      setProgress(95);

      const usedDemo = !result.ok;
      if (!result.ok) {
        toast.warning("Demo Mode", {
          description: FRIENDLY_REASONS[result.reason] ?? "AI is unavailable — showing sample results.",
        });
      }

      const doc: AnalyzedDoc = {
        id: `doc-${Date.now()}`,
        fileName: file.name,
        fileSize: file.size,
        pageCount: pages.length,
        createdAt: Date.now(),
        demo: usedDemo,
        analysis: result.ok ? result.analysis : DEMO_ANALYSIS,
        pages: usedDemo ? DEMO_PAGES : pages,
      };
      saveCurrentDoc(doc);
      setProgress(100);
      navigate({ to: "/dashboard" });
    } catch (error) {
      setStage("idle");
      setProgress(0);
      toast.error("We couldn't read that PDF", {
        description:
          error instanceof FriendlyError
            ? error.message
            : "Something went wrong while reading the file. Please try another PDF.",
      });
    }
  }

  function runDemo() {
    const doc = buildDemoDoc();
    saveCurrentDoc(doc);
    toast.success("Demo Mode ready", { description: "Exploring a sample study PDF." });
    navigate({ to: "/dashboard" });
  }

  return (
    <div id="upload" className="scroll-mt-24">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        className={`surface-card rounded-3xl border-2 border-dashed p-8 text-center transition-all sm:p-12 ${
          dragging
            ? "border-primary glow-ring scale-[1.01]"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />

        {!file ? (
          <>
            <span className="bg-gradient-spark mx-auto grid size-16 place-items-center rounded-2xl text-primary-foreground shadow-lift animate-float">
              <UploadCloud className="size-8" />
            </span>
            <h3 className="mt-5 text-xl font-semibold">Drag & drop your PDF here</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload your PDF and let StudySpark find the spark inside it!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="bg-gradient-spark text-primary-foreground"
                onClick={() => inputRef.current?.click()}
              >
                <UploadCloud className="size-4" /> Upload PDF
              </Button>
              <Button size="lg" variant="outline" onClick={runDemo}>
                <Wand2 className="size-4" /> Try Demo Mode
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Text PDFs up to 25 MB · Scanned PDFs coming soon with OCR
            </p>
          </>
        ) : (
          <div className="mx-auto max-w-xl text-left">
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)} · PDF document
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                disabled={busy}
                aria-label="Remove PDF"
                onClick={() => {
                  setFile(null);
                  setProgress(0);
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            {busy && (
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin text-primary" />
                    {stage === "reading"
                      ? "Reading your PDF…"
                      : "StudySpark is finding what matters…"}
                  </span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {!busy && (
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-gradient-spark text-primary-foreground"
                  onClick={analyze}
                >
                  <Wand2 className="size-4" /> Analyze with StudySpark
                </Button>
                <Button size="lg" variant="outline" onClick={() => inputRef.current?.click()}>
                  Replace PDF
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
