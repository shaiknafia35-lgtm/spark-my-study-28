import type { AnalyzedDoc } from "./studyspark-types";

const CURRENT_KEY = "studyspark:current";
const RECENT_KEY = "studyspark:recent";
const BOOKMARK_KEY = "studyspark:bookmarks";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveCurrentDoc(doc: AnalyzedDoc) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(doc));
    const recent = getRecentDocs().filter((d) => d.id !== doc.id);
    recent.unshift({
      id: doc.id,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      pageCount: doc.pageCount,
      createdAt: doc.createdAt,
      demo: doc.demo,
      topics: doc.analysis.topics.length,
    });
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 6)));
  } catch {
    /* storage full — non fatal */
  }
}

export function getCurrentDoc(): AnalyzedDoc | null {
  if (typeof window === "undefined") return null;
  return safeParse<AnalyzedDoc | null>(localStorage.getItem(CURRENT_KEY), null);
}

export function clearCurrentDoc() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_KEY);
}

export interface RecentDoc {
  id: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  createdAt: number;
  demo: boolean;
  topics: number;
}

export function getRecentDocs(): RecentDoc[] {
  if (typeof window === "undefined") return [];
  return safeParse<RecentDoc[]>(localStorage.getItem(RECENT_KEY), []);
}

export function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  return safeParse<string[]>(localStorage.getItem(BOOKMARK_KEY), []);
}

export function toggleBookmark(id: string): string[] {
  const list = getBookmarks();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
  return next;
}

export function downloadText(fileName: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
