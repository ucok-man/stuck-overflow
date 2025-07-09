/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";

import RichTextEditor from "@/components/rich-text-editor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
// import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { InputTags } from "@/components/ui/input-tags";
import { api } from "@/trpc/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(5).max(150),
  content: z.string().min(100),
  tags: z.array(z.string().min(1).max(20)).nonempty().max(3),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateForm() {
  const [isRedirecting, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const queryclient = useQueryClient();
  const createQuestion = api.question.create.useMutation();

  const onSubmit = (data: FormData) => {
    createQuestion.mutate(data, {
      onSuccess: (question) => {
        toast.success("Success creating question.");
        queryclient.refetchQueries({
          type: "active",
        });
        form.reset();
        startTransition(() => {
          router.push(`/question/${question.id}`);
        });
      },
      onError: () => {
        toast.error("Failed to posing question. Please try again shortly!");
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="font-paragraph-semibold text-dark-400_light-800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus font-paragraph-regular bg-light-900_dark-300 border-light-2 text-dark-300_light-700 focus-visible:border-primary-500 min-h-[46px] border focus-visible:ring-0 focus-visible:outline-0"
                  {...field}
                />
              </FormControl>
              <FormDescription className="font-body-regular text-light-500 mt-2.5">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="font-paragraph-semibold text-dark-400_light-800">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                {/* Wrap on div to style it */}
                <div className="has-[:focus-visible]:border-primary-500 border-light-2 relative mt-3.5 overflow-hidden rounded-md border">
                  <RichTextEditor
                    initialValue=""
                    onChange={(html) => {
                      field.onChange(html);
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription className="font-body-regular text-light-500 mt-2.5">
                Introduce the problem and expand on what you put in the title.
                Minimum 100 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="font-paragraph-semibold text-dark-400_light-800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <InputTags
                  {...field}
                  placeholder="Hit enter, comma sparated..."
                  className="has-[:focus-visible]:border-primary-500 h dark:has-[:focus-visible]:border-primary-500 min-h-[46px] has-[:focus-visible]:ring-0 has-[:focus-visible]:outline-0"
                  inputClass="font-paragraph-regular text-dark-300_light-700 placeholder!"
                  badgeClass="font-subtle-medium bg-light-800_dark-300 text-light-400_light-500 rounded-md border-none px-4 py-2 uppercase"
                  maxItem={3}
                />
              </FormControl>
              <FormDescription className="font-body-regular text-light-500 mt-2.5">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-primary-gradient !text-light-900 w-fit cursor-pointer"
          disabled={createQuestion.isPending || isRedirecting}
        >
          {createQuestion.isPending
            ? "Posting..."
            : isRedirecting
              ? "Redirecting..."
              : "Ask a Question"}
        </Button>
      </form>
    </Form>
  );
}
