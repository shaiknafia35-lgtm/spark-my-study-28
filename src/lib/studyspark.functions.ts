import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  AiUnavailableError,
  analyzeDocument,
  askQuestion,
  explainTopic,
} from "./studyspark-ai.server";

const pagesSchema = z.array(z.object({ page: z.number(), text: z.string() }));

export const analyzePdf = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ pages: pagesSchema }).parse(data))
  .handler(async ({ data }) => {
    try {
      return { ok: true as const, analysis: await analyzeDocument(data.pages) };
    } catch (error) {
      return {
        ok: false as const,
        reason: error instanceof AiUnavailableError ? error.message : "unknown",
      };
    }
  });

export const explainTopicFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ pages: pagesSchema, topic: z.string(), beginner: z.boolean() }).parse(data),
  )
  .handler(async ({ data }) => {
    try {
      return {
        ok: true as const,
        text: await explainTopic(data.pages, data.topic, data.beginner),
      };
    } catch (error) {
      return {
        ok: false as const,
        reason: error instanceof AiUnavailableError ? error.message : "unknown",
      };
    }
  });

export const askStudySpark = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        pages: pagesSchema,
        history: z.array(
          z.object({ role: z.enum(["user", "assistant"]), content: z.string() }),
        ),
        question: z.string().min(1),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    try {
      return {
        ok: true as const,
        text: await askQuestion(data.pages, data.history, data.question),
      };
    } catch (error) {
      return {
        ok: false as const,
        reason: error instanceof AiUnavailableError ? error.message : "unknown",
      };
    }
  });
