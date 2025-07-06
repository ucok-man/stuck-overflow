import type { GlobalFilterType } from "@/lib/types/global-filter-type";
import { shuffle } from "@/server/utils";
import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const commonRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        query: z.string().trim().nullable().optional(),
        type: z
          .enum(["question", "answer", "tag", "user"])
          .nullable()
          .optional(),
        limit: z.number().default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      const term = input.query?.split(" ").join(" & ");
      if (!term) {
        return [] as {
          id: string;
          content: string;
          type: GlobalFilterType;
        }[];
      }

      if (!input.type) {
        /* -------------------------- Search All -------------------------- */
        const [questions, answers, tags, users] = await Promise.all([
          ctx.db.question.findMany({
            where: {
              title: {
                search: term,
                mode: "insensitive",
              },
            },
            take: input.limit,
          }),

          ctx.db.answer.findMany({
            where: {
              content: {
                search: term,
                mode: "insensitive",
              },
            },
            take: input.limit,
          }),

          ctx.db.tag.findMany({
            where: {
              name: {
                search: term,
                mode: "insensitive",
              },
            },
            take: input.limit,
          }),

          ctx.db.user.findMany({
            where: {
              name: {
                search: term,
                mode: "insensitive",
              },
            },
            take: input.limit,
          }),
        ]);

        const results = shuffle([
          ...questions.map((item) => ({ ...item, type: "question" as const })),
          ...answers.map((item) => ({ ...item, type: "answer" as const })),
          ...tags.map((item) => ({ ...item, type: "tag" as const })),
          ...users.map((item) => ({ ...item, type: "user" as const })),
        ]);

        return results.slice(0, input.limit).map((item) => {
          switch (item.type) {
            case "question":
              return {
                id: item.id,
                content: item.title,
                type: item.type,
              };
            case "answer":
              return {
                id: item.id,
                content: item.content,
                type: item.type,
              };
            case "tag":
              return {
                id: item.id,
                content: item.name,
                type: item.type,
              };
            default:
              return {
                id: item.id,
                content: item.name,
                type: item.type,
              };
          }
        });
      }

      /* --------------------- Search Specific Type --------------------- */
      if (input.type === "question") {
        const questions = await ctx.db.question.findMany({
          where: {
            content: {
              search: term,
              mode: "insensitive",
            },
          },
          take: input.limit,
        });
        return questions.map((item) => ({
          id: item.id,
          content: item.title,
          type: "question" as const,
        }));
      }

      if (input.type === "answer") {
        const answers = await ctx.db.answer.findMany({
          where: {
            content: {
              search: term,
              mode: "insensitive",
            },
          },
          take: input.limit,
        });
        return answers.map((item) => ({
          id: item.id,
          content: item.content,
          type: "answer" as const,
        }));
      }

      if (input.type === "tag") {
        const tags = await ctx.db.tag.findMany({
          where: {
            name: {
              search: term,
              mode: "insensitive",
            },
          },
          take: input.limit,
        });
        return tags.map((item) => ({
          id: item.id,
          content: item.name,
          type: "tag" as const,
        }));
      }

      const users = await ctx.db.user.findMany({
        where: {
          name: {
            search: term,
            mode: "insensitive",
          },
        },
        take: input.limit,
      });
      return users.map((item) => ({
        id: item.id,
        content: item.name,
        type: "user" as const,
      }));
    }),
});
