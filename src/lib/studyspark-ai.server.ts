import type { Analysis, PdfPage } from "./studyspark-types";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";
const MAX_CHARS = 90_000;

export class AiUnavailableError extends Error {}

function pagesToContext(pages: PdfPage[]) {
  let out = "";
  for (const p of pages) {
    const chunk = `\n\n=== PAGE ${p.page} ===\n${p.text}`;
    if (out.length + chunk.length > MAX_CHARS) break;
    out += chunk;
  }
  return out.trim();
}

async function callGateway(messages: { role: string; content: string }[], jsonMode: boolean) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiUnavailableError("no-key");

  let res: Response;
  try {
    res = await fetch(GATEWAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });
  } catch {
    throw new AiUnavailableError("network");
  }

  if (res.status === 429) throw new AiUnavailableError("rate-limited");
  if (res.status === 402) throw new AiUnavailableError("credits");
  if (!res.ok) throw new AiUnavailableError("upstream");

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new AiUnavailableError("empty");
  return content;
}

const ANALYSIS_INSTRUCTIONS = `You are StudySpark, an AI study assistant for college students.
You are given the extracted text of a student's PDF, split by page markers.

Rules:
- Use ONLY information present in the document. Never invent facts, formulas or examples that are not supported by the text.
- If something (a formula, an example, a definition) is not in the document, omit that field.
- Never claim a topic will definitely appear in an exam. Priority means "based on the uploaded material".
- Write explanations in simple, friendly English suitable for a beginner.
- Always include the source page number when you can.

Return STRICT JSON only, matching exactly this shape:
{
  "title": string,
  "summary": string,
  "quickRevision": string[],
  "topics": [{"id": string, "name": string, "priority": "high"|"medium"|"low", "why": string, "explanation": string, "keyPoints": string[], "definition"?: string, "formula"?: string, "example"?: string, "page"?: number}],
  "notes": [{"heading": string, "points": string[]}],
  "definitions": [{"term": string, "meaning": string, "page"?: number}],
  "formulas": [{"expression": string, "meaning": string, "symbols": [{"symbol": string, "meaning": string}], "page"?: number}],
  "questions": {"short": string[], "long": string[], "conceptual": string[], "mcq": [{"question": string, "options": string[], "answer": string}]},
  "flashcards": [{"question": string, "answer": string, "page"?: number}]
}
Aim for 5-10 topics, 4-8 note sections, up to 12 definitions, all formulas found, 6 short / 4 long / 4 conceptual questions, 5 MCQs and 8-12 flashcards.`;

export async function analyzeDocument(pages: PdfPage[]): Promise<Analysis> {
  const raw = await callGateway(
    [
      { role: "system", content: ANALYSIS_INSTRUCTIONS },
      { role: "user", content: `Document text:\n${pagesToContext(pages)}` },
    ],
    true,
  );

  let parsed: Analysis;
  try {
    parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, "").trim());
  } catch {
    throw new AiUnavailableError("parse");
  }

  return {
    title: parsed.title || "Uploaded Study Material",
    summary: parsed.summary || "",
    quickRevision: parsed.quickRevision ?? [],
    topics: (parsed.topics ?? []).map((t, i) => ({ ...t, id: t.id || `t${i + 1}` })),
    notes: parsed.notes ?? [],
    definitions: parsed.definitions ?? [],
    formulas: (parsed.formulas ?? []).map((f) => ({ ...f, symbols: f.symbols ?? [] })),
    questions: {
      short: parsed.questions?.short ?? [],
      long: parsed.questions?.long ?? [],
      conceptual: parsed.questions?.conceptual ?? [],
      mcq: parsed.questions?.mcq ?? [],
    },
    flashcards: parsed.flashcards ?? [],
  };
}

export async function explainTopic(
  pages: PdfPage[],
  topic: string,
  beginner: boolean,
): Promise<string> {
  return callGateway(
    [
      {
        role: "system",
        content: `You are StudySpark. Explain the requested topic using ONLY the uploaded document. ${
          beginner
            ? "Explain as if the student is a complete beginner: everyday words, tiny steps, one simple analogy."
            : "Use simple English, short paragraphs and bullet points."
        } Use markdown-free plain text with "-" bullets and short paragraphs. If the topic is not covered in the document, say clearly that it was not found in the uploaded material.`,
      },
      {
        role: "user",
        content: `Document:\n${pagesToContext(pages)}\n\nExplain this topic: ${topic}`,
      },
    ],
    false,
  );
}

export async function askQuestion(
  pages: PdfPage[],
  history: { role: "user" | "assistant"; content: string }[],
  question: string,
): Promise<string> {
  return callGateway(
    [
      {
        role: "system",
        content:
          "You are StudySpark, a friendly study assistant. Answer using ONLY the uploaded document. Cite page numbers like (p. 4) when relevant. If the answer is not in the uploaded material, say plainly: \"I couldn't find that in your uploaded PDF.\" Keep answers clear, structured and student-friendly with short paragraphs and bullets.",
      },
      { role: "user", content: `Document:\n${pagesToContext(pages)}` },
      ...history.slice(-8),
      { role: "user", content: question },
    ],
    false,
  );
}
