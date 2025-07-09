import type { Answer, Question, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, privatProcedure } from "../trpc";

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

        // Remove interactions record associated with answer. (done implicitly)

        return await tx.answer.delete({
          where: {
            id: answer.id,
          },
        });
      });
    }),
});
