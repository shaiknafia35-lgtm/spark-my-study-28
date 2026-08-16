import type { PdfPage } from "./studyspark-types";

export const MAX_PDF_BYTES = 25 * 1024 * 1024;

export class FriendlyError extends Error {}

export async function extractPdfPages(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<PdfPage[]> {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new FriendlyError("That file isn't a PDF. Please upload a .pdf study material.");
  }
  if (file.size === 0) {
    throw new FriendlyError("This file looks empty. Try uploading the PDF again.");
  }
  if (file.size > MAX_PDF_BYTES) {
    throw new FriendlyError("This PDF is larger than 25 MB. Try splitting it into smaller parts.");
  }

  const pdfjs = await import("pdfjs-dist");
  const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  let doc;
  try {
    const data = new Uint8Array(await file.arrayBuffer());
    doc = await pdfjs.getDocument({ data }).promise;
  } catch {
    throw new FriendlyError(
      "We couldn't open this PDF. It may be password protected or damaged.",
    );
  }

  const pages: PdfPage[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    pages.push({ page: i, text });
    onProgress?.(Math.round((i / doc.numPages) * 100));
  }

  const total = pages.reduce((n, p) => n + p.text.length, 0);
  if (total < 200) {
    // Scanned/image PDF: OCR support can be plugged in here in the future.
    throw new FriendlyError(
      "We couldn't read any text from this PDF — it looks like a scanned document. Text-based PDFs work best right now.",
    );
  }

  return pages;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
