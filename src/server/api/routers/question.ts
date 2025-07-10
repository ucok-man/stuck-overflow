import { auth } from "@clerk/nextjs/server";
import {
  type Answer,
  type Question,
  type Tag,
  type User,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, privatProcedure, publicProcedure } from "../trpc";

export const questionRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        query: z.string().trim().nullable().optional(),
        filter: z
          .enum([
            "recommended",
            "newest",
            "frequent",
            "unanswered",
            "most_upvotes",
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

      if (input.filter === "most_upvotes") {
        params.orderBy = {
          upvotes: {
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

  getById: publicProcedure
    .input(z.object({ questionId: z.string().trim() }))
    .query(async ({ ctx, input }) => {
      const question = await ctx.db.question.findUnique({
        where: {
          id: input.questionId,
        },
        include: {
          author: true,
          tags: true,
          answers: true,
          upvotes: true,
          downvotes: true,
          savedBy: true,
        },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No question record found`,
        });
      }

      console.log({ question });

      return question;
    }),

  getByIdStrict: privatProcedure
    .input(
      z.object({
        questionId: z.string().trim(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const question = await ctx.db.question.findUnique({
        where: {
          id: input.questionId,
          authorId: ctx.user.id,
        },
        include: {
          author: true,
          tags: true,
          answers: true,
          upvotes: true,
          downvotes: true,
          savedBy: true,
        },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No question record found`,
        });
      }

      return question;
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

      // Remove interactions record (this is implicitly handled by prisma `onDelete cascade`)
      // Remove the answer acociated with question (this is also deleted implicitly)
      // Remove connection between `tags` and `question` (this also implicit deleted)

      /* -------------------- revert back reputation -------------------- */
      return await ctx.db.$transaction(async (tx) => {
        await tx.user.update({
          where: {
            id: question.authorId,
          },
          data: {
            reputation: {
              decrement: 5,
            },
          },
        });
        return await tx.question.delete({
          where: {
            id: question.id,
          },
        });
      });
    }),

  create: privatProcedure
    .input(
      z.object({
        title: z.string().min(5).max(150),
        content: z.string().min(100),
        tags: z.array(z.string().min(1).max(20)).nonempty().max(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const question = await tx.question.create({
          data: {
            title: input.title,
            content: input.content,
            tags: {
              connectOrCreate: [
                ...input.tags.map((tagname) => ({
                  create: {
                    name: tagname,
                  },
                  where: {
                    name: tagname,
                  },
                })),
              ],
            },
            authorId: ctx.user.id,
          },
        });

        // Create an interaction record for the user's ask_question action
        await tx.interaction.create({
          data: {
            userId: ctx.user.id,
            actions: {
              set: ["ASK_QUESTION"],
            },
            questionId: question.id,
            tags: {
              connect: [
                ...input.tags.map((tagname) => ({
                  name: tagname,
                })),
              ],
            },
          },
        });

        // Increment author's reputation by +5 for creating a question
        await tx.user.update({
          where: {
            id: ctx.user.id,
          },
          data: {
            reputation: {
              increment: 5,
            },
          },
        });

        return question;
      });
    }),

  update: privatProcedure
    .input(
      z.object({
        questionId: z.string().trim(),
        title: z.string().min(5).max(150),
        content: z.string().min(100),
        tags: z.array(z.string().min(1).max(20)).nonempty().max(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const question = await tx.question.findUnique({
          where: {
            id: input.questionId,
          },
        });
        if (!question) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No question record found`,
          });
        }

        await tx.question.update({
          data: {
            title: input.title,
            content: input.content,
            tags: {
              set: [], // remove all existing tag connections
              connectOrCreate: [
                ...input.tags.map((tagname) => ({
                  create: {
                    name: tagname,
                  },
                  where: {
                    name: tagname,
                  },
                })),
              ],
            },
            authorId: ctx.user.id,
          },
          where: {
            id: question.id,
          },
        });

        // update tags on interaction record
        await tx.interaction.update({
          data: {
            tags: {
              set: [], // remove all existing tag connections
              connect: [
                ...input.tags.map((tagname) => ({
                  name: tagname,
                })),
              ],
            },
          },
          where: {
            userId_questionId: {
              userId: ctx.user.id,
              questionId: question.id,
            },
          },
        });

        return question;
      });
    }),

  incrementView: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.question.update({
        where: {
          id: input.questionId,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    }),

  toggleUpvote: privatProcedure
    .input(
      z.object({
        questionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const question = await tx.question.findUnique({
          where: {
            id: input.questionId,
          },
          include: {
            upvotes: {
              where: {
                id: ctx.user.id,
              },
            },
          },
        });
        if (!question) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No question record found`,
          });
        }

        const isUpvoted = question?.upvotes.length > 0;

        if (isUpvoted) {
          /* ------------------------- Remove upvote ------------------------ */
          await tx.question.update({
            where: { id: question.id },
            data: {
              upvotes: {
                disconnect: { id: ctx.user.id },
              },
            },
          });

          /* ---------------- revert current user reputation ---------------- */
          await tx.user.update({
            where: {
              id: ctx.user.id,
            },
            data: {
              reputation: {
                decrement: 1,
              },
            },
          });

          /* ------------------- revert author reputation ------------------- */
          await tx.user.update({
            where: {
              id: question.authorId,
            },
            data: {
              reputation: {
                decrement: 10,
              },
            },
          });

          return;
        }

        /* -------------------------- add upvote -------------------------- */
        await tx.question.update({
          where: { id: question.id },
          data: {
            upvotes: {
              connect: { id: ctx.user.id },
            },
          },
        });

        /* ---------------- add current user reputation ---------------- */
        await tx.user.update({
          where: {
            id: ctx.user.id,
          },
          data: {
            reputation: {
              increment: 1,
            },
          },
        });

        /* ------------------- add author reputation ------------------- */
        await tx.user.update({
          where: {
            id: question.authorId,
          },
          data: {
            reputation: {
              increment: 10,
            },
          },
        });
      });
    }),

  toggleDownvote: privatProcedure
    .input(
      z.object({
        questionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const question = await tx.question.findUnique({
          where: {
            id: input.questionId,
          },
          include: {
            downvotes: {
              where: {
                id: ctx.user.id,
              },
            },
          },
        });
        if (!question) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No question record found`,
          });
        }

        const isDownvoted = question?.downvotes.length > 0;

        console.log({ isDownvoted });

        if (isDownvoted) {
          /* ------------------------ Remove downvote ------------------------ */
          await tx.question.update({
            where: { id: question.id },
            data: {
              downvotes: {
                disconnect: { id: ctx.user.id },
              },
            },
          });

          /* ---------------- revert current user reputation ---------------- */
          await tx.user.update({
            where: {
              id: ctx.user.id,
            },
            data: {
              reputation: {
                decrement: 1, // user upvote/downvote will have +1 reputation
              },
            },
          });

          return;
        }

        /* -------------------------- add downvote -------------------------- */
        await tx.question.update({
          where: { id: question.id },
          data: {
            downvotes: {
              connect: { id: ctx.user.id },
            },
          },
        });

        /* ---------------- add current user reputation ---------------- */
        await tx.user.update({
          where: {
            id: ctx.user.id,
          },
          data: {
            reputation: {
              increment: 1,
            },
          },
        });
      });
    }),

  toggleSaveToCollection: privatProcedure
    .input(
      z.object({
        questionId: z.string().trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const question = await tx.question.findUnique({
          where: {
            id: input.questionId,
          },
          include: {
            savedBy: {
              where: {
                id: ctx.user.id,
              },
            },
            tags: true,
          },
        });
        if (!question) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No question record found`,
          });
        }

        const isAlreadySaved = question?.savedBy.length > 0;

        if (isAlreadySaved) {
          await tx.question.update({
            where: { id: question.id },
            data: {
              savedBy: {
                disconnect: { id: ctx.user.id },
              },
            },
          });

          await tx.interaction.upsert({
            where: {
              userId_questionId: {
                userId: ctx.user.id,
                questionId: question.id,
              },
            },
            create: {
              actions: {
                set: ["SAVE_QUESTION"],
              },
              questionId: question.id,
              userId: ctx.user.id,
              tags: {
                connect: question.tags,
              },
            },
            update: {
              actions: {
                push: "SAVE_QUESTION",
              },
            },
          });
          return;
        }

        await tx.question.update({
          where: { id: question.id },
          data: {
            savedBy: {
              connect: { id: ctx.user.id },
            },
          },
        });

        const interaction = await tx.interaction.findFirst({
          where: {
            actions: {
              has: "SAVE_QUESTION",
            },
            questionId: question.id,
            userId: ctx.user.id,
          },
        });

        if (interaction && interaction.actions.length > 1) {
          const actions = interaction.actions.filter(
            (r) => r !== "SAVE_QUESTION",
          );
          await tx.interaction.update({
            where: {
              id: interaction.id,
            },
            data: {
              actions: actions,
            },
          });
        } else if (interaction && interaction.actions.length === 1) {
          await tx.interaction.delete({
            where: {
              id: interaction.id,
            },
          });
        }
      });
    }),
});
