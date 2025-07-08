import { auth } from "@clerk/nextjs/server";
import type { Answer, Question, Tag, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, privatProcedure, publicProcedure } from "../trpc";

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
          answers: true,
          upvotes: true,
          downvotes: true,
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
        if (!user)
          return [] as (Question & {
            author: User;
            tags: Tag[];
            answers: Answer[];
            upvotes: User[];
            downvotes: User[];
          })[];

        const interactions = await ctx.db.interaction.findMany({
          where: {
            userId: user.id,
          },
          include: {
            tags: true,
          },
        });

        if (!interactions.length)
          return [] as (Question & {
            author: User;
            tags: Tag[];
            answers: Answer[];
            upvotes: User[];
            downvotes: User[];
          })[];

        const tags = [...new Set(interactions.map((i) => i.tags).flat())];

        params.where!.tags = {
          every: {
            name: {
              in: tags.map((t) => t.name),
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

      const questions = await ctx.db.question.findMany(params);
      return questions as (Question & {
        author: User;
        tags: Tag[];
        answers: Answer[];
        upvotes: User[];
        downvotes: User[];
      })[];
    }),

  getAllByTag: privatProcedure
    .input(
      z.object({
        tagId: z.string().trim(),
        query: z.string().trim().nullable().optional(),
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
    .query(async ({ input, ctx }) => {
      const term = input.query?.split(" ").join(" & ");

      const params: NonNullable<
        Parameters<typeof ctx.db.question.findMany>[0]
      > = {
        where: {
          tags: {
            some: {
              id: input.tagId,
            },
          },
        },
        include: {
          author: true,
          tags: true,
          answers: true,
          upvotes: true,
          downvotes: true,
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

      const questions = await ctx.db.question.findMany(params);
      return questions as (Question & {
        author: User;
        tags: Tag[];
        answers: Answer[];
        upvotes: User[];
        downvotes: User[];
      })[];
    }),

  getAllByClerkId: privatProcedure
    .input(
      z.object({
        clerkId: z.string().trim(),
        query: z.string().trim().nullable().optional(),
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
    .query(async ({ input, ctx }) => {
      const term = input.query?.split(" ").join(" & ");

      const params: NonNullable<
        Parameters<typeof ctx.db.question.findMany>[0]
      > = {
        where: {
          author: {
            clerkId: input.clerkId,
          },
        },
        include: {
          author: true,
          tags: true,
          answers: true,
          upvotes: true,
          downvotes: true,
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

      const questions = await ctx.db.question.findMany(params);
      return questions as (Question & {
        author: User;
        tags: Tag[];
        answers: Answer[];
        upvotes: User[];
        downvotes: User[];
      })[];
    }),

  getCollection: privatProcedure
    .input(
      z.object({
        query: z.string().trim().nullable().optional(),
        filter: z
          .enum([
            "newest",
            "oldest",
            "most_voted",
            "most_viewed",
            "most_answered",
          ])
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
    .query(async ({ input, ctx }) => {
      const term = input.query?.split(" ").join(" & ");

      const params: NonNullable<
        Parameters<typeof ctx.db.question.findMany>[0]
      > = {
        where: {
          savedBy: {
            some: {
              id: ctx.user.id,
            },
          },
        },
        include: {
          author: true,
          tags: true,
          answers: true,
          upvotes: true,
          downvotes: true,
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

      if (input.filter === "newest") {
        params.orderBy = {
          createdAt: "desc",
        };
      }

      if (input.filter === "oldest") {
        params.orderBy = {
          createdAt: "asc",
        };
      }

      if (input.filter === "most_voted") {
        params.orderBy = {
          upvotes: {
            _count: "desc",
          },
        };
      }

      if (input.filter === "most_viewed") {
        params.orderBy = {
          views: "desc",
        };
      }

      if (input.filter === "most_answered") {
        params.orderBy = {
          answers: {
            _count: "desc",
          },
        };
      }

      const questions = await ctx.db.question.findMany(params);
      return questions as (Question & {
        author: User;
        tags: Tag[];
        answers: Answer[];
        upvotes: User[];
        downvotes: User[];
      })[];
    }),

  delete: privatProcedure
    .input(
      z.object({
        questionId: z.string().trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.db.question.findUnique({
        where: {
          id: input.questionId,
          authorId: ctx.user.id,
        },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No question record found`,
        });
      }

      return await ctx.db.question.delete({
        where: {
          id: question.id,
        },
      });
    }),
});
