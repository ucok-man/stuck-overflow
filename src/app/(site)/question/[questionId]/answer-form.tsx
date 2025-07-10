/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";

// import { useTheme } from "@/context/ThemeProvider";
// import { createAnswer } from "@/lib/actions/answer.action";
import RichTextEditor from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Question } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  content: z.string().trim().min(1),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  question: Question;
};

export default function AnswerForm({ question }: Props) {
  const [isRefreshing, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const createAnswer = api.answer.create.useMutation();
  const queryclient = useQueryClient();

  const handleCreateAnswer = async (data: FormData) => {
    createAnswer.mutate(
      {
        content: data.content,
        questionId: question.id,
      },
      {
        onSuccess: () => {
          queryclient.refetchQueries({
            type: "active",
          });
          form.reset();
          toast.success("Success creating answer");
          startTransition(() => {
            router.refresh();
          });
        },
        onError: () => {
          toast.error("Oops! Please try again in a bit 😊");
        },
      },
    );
  };

  const handleGenerateAI = async () => {
    console.log("TODO: generate AI answers");
  };

  //   const generateAIAnswer = async () => {
  //     if (!authorId) return;

  //     setSetIsSubmittingAI(true);

  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
  //         {
  //           method: "POST",
  //           body: JSON.stringify({ question }),
  //         },
  //       );

  //       const aiAnswer = await response.json();

  //       // Convert plain text to HTML format

  //       const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br />");

  //       if (editorRef.current) {
  //         const editor = editorRef.current as any;
  //         editor.setContent(formattedAnswer);
  //       }

  //       // Toast...
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setSetIsSubmittingAI(false);
  //     }
  //   };

  const isSubmittingAI = false;
  const isActionLoading = createAnswer.isPending || isRefreshing;

  return (
    <div>
      <div className="flex flex-col items-center justify-start gap-5 sm:flex-row sm:gap-2">
        <h4 className="font-paragraph-semibold text-dark-400_light-800">
          Write your answer here
        </h4>
      </div>

      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl>
                  {/* Wrap on div to style it */}
                  <div className="has-[:focus-visible]:border-primary-500 border-light-2 relative mt-3.5 overflow-hidden rounded-md border">
                    <RichTextEditor
                      initialValue={form.getValues("content")}
                      onChange={(html) => {
                        field.onChange(html);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="max-xs:flex-col xs:items-center xs:justify-between flex gap-5">
            <Button
              className="btn! max-xs:w-full border-light-2 text-primary-500 dark:text-primary-500 cursor-pointer gap-1.5 rounded-md px-4 py-2.5 shadow-none"
              onClick={handleGenerateAI}
              type="button"
              disabled={isActionLoading} // TODO: add is submiting ai as pending also
            >
              {isSubmittingAI ? (
                <>Generating...</>
              ) : (
                <>
                  <Image
                    src="/assets/icons/stars.svg"
                    alt="star"
                    width={12}
                    height={12}
                    className="object-contain"
                  />
                  Generate AI Answer
                </>
              )}
            </Button>

            <Button
              type="submit"
              className="bg-primary-gradient xs:w-fit w-full cursor-pointer text-white"
              disabled={isActionLoading} // TODO: add is submiting ai as pending also
            >
              {createAnswer.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
