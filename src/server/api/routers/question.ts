import { auth } from "@clerk/nextjs/server";
import type { Question } from "@prisma/client";
import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
// import type {Question} from "@prisma/client/runtime/library.js";

export const questionRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        query: z.string().trim().nullable().optional(),
        filter: z
          .enum(["recommended", "newest", "frequent", "unanswered"])
          .nullable()
          .optional()
          .default("newest"),
        pageSize: z
          .string()
          .trim()
          .refine((arg) => !isNaN(Number(arg)), { message: "Invalid number" }) // Ensure it's a valid number
          .transform((arg) => Number(arg))
          .pipe(z.number().min(1).max(100)) // Validate after transformation
          .optional()
          .default("10"),
        page: z
          .string()
          .trim()
          .refine((arg) => !isNaN(Number(arg)), { message: "Invalid number" }) // Ensure it's a valid number
          .transform((arg) => Number(arg))
          .pipe(z.number().min(1).max(1000)) // Validate after transformation
          .optional()
          .default("1"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const term = input.query?.split(" ").join(" & ");

      const params: NonNullable<
        Parameters<typeof ctx.db.question.findMany>[0]
      > = {
        where: {},
        include: {
          author: true,
          tags: true,
        },
        take: input.pageSize,
        skip: (input.page - 1) * input.pageSize,
      };

      if (term) {
        params.where!.OR = [
          {
            title: {
              search: term,
              mode: "insensitive",
            },
          },
          {
            content: {
              search: term,
              mode: "insensitive",
            },
          },
        ];
      }

      if (input.filter === "recommended") {
        const { userId: clerkId } = await auth();
        const user = await ctx.db.user.findUnique({
          where: {
            clerkId: clerkId ?? "",
          },
        });
        if (!user) return [] as Question[];

        const interactions = await ctx.db.interaction.findMany({
          where: {
            userId: user.id,
          },
          include: {
            tags: true,
          },
        });

        if (!interactions.length) return [] as Question[];

        const tags = [...new Set(interactions.map((i) => i.tags).flat())];

        params.where!.tags = {
          every: {
            name: {
              in: tags.map((t) => t.name as string),
            },
          },
        };
      }

      if (input.filter === "newest") {
        params.orderBy = {
          createdAt: "desc",
        };
      }

      if (input.filter === "frequent") {
        params.orderBy = {
          views: "desc",
        };
      }

      if (input.filter === "unanswered") {
        params.where!.answers = {
          none: {},
        };
      }

      console.log({ params });

      const questions = await ctx.db.question.findMany(params);
      return questions;
    }),
});
