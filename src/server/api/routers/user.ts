import { BADGE_CRITERIA_ENUM } from "@/lib/constants/badge-criteria";
import { calculateBadge } from "@/lib/utils";
import type { Tag } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
// import type {Question} from "@prisma/client/runtime/library.js";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        query: z.string().trim().nullable().optional(),
        filter: z
          .enum(["newest", "oldest", "top_contributors"])
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

      const params: NonNullable<Parameters<typeof ctx.db.user.findMany>[0]> = {
        where: {},
        include: {},
        take: input.pageSize,
        skip: (input.page - 1) * input.pageSize,
      };

      if (term) {
        params.where!.OR = [
          {
            name: {
              search: term,
              mode: "insensitive",
            },
          },
          {
            username: {
              search: term,
              mode: "insensitive",
            },
          },
        ];
      }

      if (input.filter === "newest") {
        params.orderBy = {
          joinedAt: "desc",
        };
      }

      if (input.filter === "oldest") {
        params.orderBy = {
          joinedAt: "asc",
        };
      }

      if (input.filter === "top_contributors") {
        params.orderBy = {
          reputation: "desc",
        };
      }

      const users = await ctx.db.user.findMany(params);
      return users;
    }),

  getTopTag: publicProcedure
    .input(
      z.object({
        clerkId: z.string().trim(),
        take: z.number().positive().default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          clerkId: input.clerkId,
        },
        include: {
          interactions: {
            include: {
              tags: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user found for clerk id #${input.clerkId}`,
        });
      }

      const indexer = new Map<string, number>();
      const taggroup: { tag: Tag; count: number }[] = [];

      const tags = user.interactions.map((i) => i.tags).flat();
      tags.forEach((tag) => {
        if (!indexer.has(tag.name)) {
          taggroup.push({ tag: tag, count: 1 });
          indexer.set(tag.name, taggroup.length - 1);
          return;
        }

        const idx = indexer.get(tag.name)!;
        taggroup[idx]!.count += 1;
      });

      taggroup.sort((a, b) => b.count - a.count);

      return taggroup.slice(0, input.take);
    }),

  getProfile: publicProcedure
    .input(
      z.object({
        clerkId: z.string().trim(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `There is no user with clerk id #${input.clerkId}`,
        });

      // get total question created
      const totalQuestionCreated = await ctx.db.question.count({
        where: {
          authorId: user.id,
        },
      });

      // get total answer created
      const totalAnswerCreated = await ctx.db.answer.count({
        where: {
          authorId: user.id,
        },
      });

      // get total question upvotes
      const qs = await ctx.db.question.findMany({
        where: {
          authorId: user.id,
        },
        include: {
          _count: {
            select: {
              upvotes: true,
            },
          },
        },
      });

      const totalQuestionUpvotes = qs.reduce((total, q) => {
        return total + q._count.upvotes;
      }, 0);

      // get total answer upvotes
      const ans = await ctx.db.answer.findMany({
        where: {
          authorId: user.id,
        },
        include: {
          _count: {
            select: {
              upvotes: true,
            },
          },
        },
      });
      const totalAnswerUpvotes = ans.reduce((acc, a) => {
        return acc + a._count.upvotes;
      }, 0);

      // get total question views
      const totalQuestionView = await ctx.db.question
        .aggregate({
          _sum: {
            views: true,
          },
        })
        .then((res) => res._sum.views ?? 0);

      // calculate badge achievment
      const badge = calculateBadge({
        criterias: [
          {
            type: BADGE_CRITERIA_ENUM.TOTAL_ANSWER_CREATED,
            count: totalAnswerCreated,
          },
          {
            type: BADGE_CRITERIA_ENUM.TOTAL_ANSWER_UPVOTES,
            count: totalAnswerUpvotes,
          },
          {
            type: BADGE_CRITERIA_ENUM.TOTAL_QUESTION_CREATED,
            count: totalQuestionCreated,
          },
          {
            type: BADGE_CRITERIA_ENUM.TOTAL_QUESTION_UPVOTES,
            count: totalQuestionUpvotes,
          },
          {
            type: BADGE_CRITERIA_ENUM.TOTAL_QUESTION_VIEWS,
            count: totalQuestionView,
          },
        ],
      });

      return {
        user: user,
        count: {
          questionCreated: totalQuestionCreated,
          questionUpvotes: totalQuestionUpvotes,
          questionViews: totalQuestionView,
          answerCreated: totalAnswerCreated,
          answerUpvotes: totalAnswerUpvotes,
        },
        badge: badge,
      };
    }),
});
