import type { Answer, Question, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, privatProcedure, publicProcedure } from "../trpc";

export const answerRouter = createTRPCRouter({
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

      const params: NonNullable<Parameters<typeof ctx.db.answer.findMany>[0]> =
        {
          where: {
            author: {
              clerkId: input.clerkId,
            },
          },
          include: {
            author: true,
            upvotes: true,
            downvotes: true,
            question: true,
          },
          take: input.pageSize,
          skip: (input.page - 1) * input.pageSize,
        };

      if (term) {
        params.where!.content = {
          search: term,
          mode: "insensitive",
        };
      }

      const answers = await ctx.db.answer.findMany(params);
      return answers as (Answer & {
        author: User;
        question: Question;
        upvotes: User[];
        downvotes: User[];
      })[];
    }),

  getAll: publicProcedure
    .input(
      z.object({
        questionId: z.string().trim(),
        query: z.string().trim().nullable().optional(),
        filter: z
          .enum(["newest", "oldest", "most_upvotes", "most_downvotes"])
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

      const params: NonNullable<Parameters<typeof ctx.db.answer.findMany>[0]> =
        {
          where: {
            questionId: input.questionId,
          },
          include: {
            author: true,
            upvotes: true,
            downvotes: true,
          },
          take: input.pageSize,
          skip: (input.page - 1) * input.pageSize,
        };

      if (term) {
        params.where!.content = {
          search: term,
          mode: "insensitive",
        };
      }

      const answers = await ctx.db.answer.findMany(params);
      return answers as (Answer & {
        author: User;
        upvotes: User[];
        downvotes: User[];
      })[];
    }),

  delete: privatProcedure
    .input(
      z.object({
        answerId: z.string().trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const answer = await tx.answer.findUnique({
          where: {
            id: input.answerId,
            authorId: ctx.user.id,
          },
        });

        if (!answer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No answer record found`,
          });
        }

        // Update interactions record associated with answer. (done implicitly)
        const interaction = await tx.interaction.findFirst({
          where: {
            actions: {
              has: "ANSWER",
            },
            questionId: answer.questionId,
            userId: ctx.user.id,
          },
        });

        if (interaction && interaction.actions.length > 1) {
          // In case there is multiple `ANSWER` value pushed
          const idx = interaction.actions.findIndex(
            (name) => name === "ANSWER",
          );
          const actions = interaction.actions.filter((_, i) => i !== idx);

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

        // Revert back the reputation given -10
        await tx.user.update({
          where: {
            id: ctx.user.id,
          },
          data: {
            reputation: {
              decrement: 10,
            },
          },
        });

        // Delete answer record
        return await tx.answer.delete({
          where: {
            id: answer.id,
          },
        });
      });
    }),

  create: privatProcedure
    .input(
      z.object({
        questionId: z.string().trim(),
        content: z.string().trim().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.db.question.findUnique({
        where: {
          id: input.questionId,
        },
        include: {
          tags: true,
        },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No question record found",
        });
      }

      return ctx.db.$transaction(async (tx) => {
        const answer = await tx.answer.create({
          data: {
            content: input.content,
            authorId: ctx.user.id,
            questionId: question.id,
          },
        });

        // Update interactions or create it
        await tx.interaction.upsert({
          where: {
            userId_questionId: {
              questionId: answer.questionId,
              userId: ctx.user.id,
            },
          },
          create: {
            actions: {
              set: ["ANSWER"],
            },
            questionId: answer.questionId,
            userId: ctx.user.id,
            tags: {
              connect: question.tags,
            },
          },
          update: {
            actions: {
              push: ["ANSWER"],
            },
          },
        });

        // Increment reputation by +10 to author
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
      });
    }),

  toggleUpvote: privatProcedure
    .input(
      z.object({
        answerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const answer = await tx.answer.findUnique({
          where: {
            id: input.answerId,
          },
          include: {
            upvotes: {
              where: {
                id: ctx.user.id,
              },
            },
          },
        });
        if (!answer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No answer record found`,
          });
        }

        const isUpvoted = answer?.upvotes.length > 0;

        if (isUpvoted) {
          /* ------------------------- Remove upvote ------------------------ */
          await tx.answer.update({
            where: { id: answer.id },
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
              id: answer.authorId,
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
        await tx.answer.update({
          where: { id: answer.id },
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
            id: answer.authorId,
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
        answerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const answer = await tx.answer.findUnique({
          where: {
            id: input.answerId,
          },
          include: {
            downvotes: {
              where: {
                id: ctx.user.id,
              },
            },
          },
        });
        if (!answer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No answer record found`,
          });
        }

        const isDownvoted = answer?.downvotes.length > 0;

        if (isDownvoted) {
          /* ------------------------ Remove downvote ------------------------ */
          await tx.answer.update({
            where: { id: answer.id },
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
        await tx.answer.update({
          where: { id: answer.id },
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
});
