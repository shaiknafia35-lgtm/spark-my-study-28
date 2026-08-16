export type Priority = "high" | "medium" | "low";

export interface Topic {
  id: string;
  name: string;
  priority: Priority;
  why: string;
  explanation: string;
  keyPoints: string[];
  definition?: string | undefined;
  formula?: string | undefined;
  example?: string | undefined;
  page?: number | undefined;
}

export interface NoteSection {
  heading: string;
  points: string[];
}

export interface Definition {
  term: string;
  meaning: string;
  page?: number | undefined;
}

export interface FormulaItem {
  expression: string;
  meaning: string;
  symbols: { symbol: string; meaning: string }[];
  page?: number | undefined;
}

export interface McqItem {
  question: string;
  options: string[];
  answer: string;
}

export interface QuestionBank {
  short: string[];
  long: string[];
  conceptual: string[];
  mcq: McqItem[];
}

export interface Flashcard {
  question: string;
  answer: string;
  page?: number | undefined;
}

export interface Analysis {
  title: string;
  summary: string;
  quickRevision: string[];
  topics: Topic[];
  notes: NoteSection[];
  definitions: Definition[];
  formulas: FormulaItem[];
  questions: QuestionBank;
  flashcards: Flashcard[];
}

export interface AnalyzedDoc {
  id: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  createdAt: number;
  demo: boolean;
  analysis: Analysis;
  pages: { page: number; text: string }[];
}

export interface PdfPage {
  page: number;
  text: string;
}
