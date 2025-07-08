/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type Props = {
  user: User;
};

const formSchema = z.object({
  name: z.string().trim().min(5).max(50),
  username: z.string().trim().min(5).max(50),
  bio: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .pipe(z.string().min(10).max(200).optional()),

  portfolioWebsite: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .pipe(z.string().url().optional()),

  location: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .pipe(z.string().min(5).max(100).optional()),
});

type FormData = z.infer<typeof formSchema>;

export default function EditForm({ user }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      portfolioWebsite: user.portfolioWebsite ?? "",
      location: user.location ?? "",
      bio: user.bio ?? "",
    },
  });

  const edituser = api.user.edit.useMutation();
  const queryClient = useQueryClient();

  const onSubmit = (data: FormData) => {
    edituser.mutate(data, {
      onSuccess: () => {
        queryClient.refetchQueries({
          type: "active",
        });
        toast.success("Success updating profile.");
      },
      onError: () => {
        toast.error("Failed to execute action. Please try again later!");
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full flex-col gap-9"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="font-paragraph-semibold text-dark-400_light-800">
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  className="no-focus font-paragraph-regular border-light-2 bg-light-800_dark-300 text-dark-300_light-700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="font-paragraph-semibold text-dark-400_light-800">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your username"
                  className="no-focus font-paragraph-regular border-light-2 bg-light-800_dark-300 text-dark-300_light-700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="font-paragraph-semibold text-dark-400_light-800">
                Portfolio Link
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Your portfolio URL"
                  className="no-focus font-paragraph-regular border-light-2 bg-light-800_dark-300 text-dark-300_light-700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="font-paragraph-semibold text-dark-400_light-800">
                Location
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Where are you from?"
                  className="no-focus font-paragraph-regular border-light-2 bg-light-800_dark-300 text-dark-300_light-700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="font-paragraph-semibold text-dark-400_light-800">
                Bio <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's special about you?"
                  className="no-focus font-paragraph-regular border-light-2 bg-light-800_dark-300 text-dark-300_light-700 h-[70px] resize-none border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="bg-primary-gradient text-dark-300_light-700 w-[100px] cursor-pointer"
            disabled={edituser.isPending}
          >
            {edituser.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
