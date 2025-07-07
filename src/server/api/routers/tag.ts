import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const tagRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        query: z.string().trim().nullable().optional(),
        filter: z
          .enum(["newest", "oldest", "popular", "name"])
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

      const params: NonNullable<Parameters<typeof ctx.db.tag.findMany>[0]> = {
        where: {},
        include: {
          _count: {
            select: {
              questions: true,
            },
          },
        },
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
            description: {
              search: term,
              mode: "insensitive",
            },
          },
        ];
      }
      if (input.filter === "newest") {
        params.orderBy = {
          createdOn: "desc",
        };
      }

      if (input.filter === "oldest") {
        params.orderBy = {
          createdOn: "asc",
        };
      }

      if (input.filter === "name") {
        params.orderBy = {
          name: "asc",
        };
      }

      if (input.filter === "popular") {
        params.orderBy = {
          questions: {
            _count: "desc",
          },
        };
      }

      const tags = await ctx.db.tag.findMany(params);
      return tags as ({
        _count: {
          questions: number;
        };
      } & {
        name: string;
        id: string;
        description: string;
        createdOn: Date;
      })[];
    }),

  getById: publicProcedure
    .input(
      z.object({
        tagId: z.string().trim(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const tag = await ctx.db.tag.findUnique({
        where: {
          id: input.tagId,
        },
      });

      if (!tag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `There is tag for id #${input.tagId}`,
        });
      }

      return tag;
    }),
});
