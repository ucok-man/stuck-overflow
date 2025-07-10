/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";

import { api } from "@/trpc/react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";

type Props = {
  questionId: string;
};

export default function RemoveButton({ questionId }: Props) {
  const queryclient = useQueryClient();
  const deleteQuestion = api.question.delete.useMutation();

  return (
    <Image
      src="/assets/icons/trash.svg"
      alt="Delete"
      width={14}
      height={14}
      className="cursor-pointer object-contain"
      onClick={() => {
        deleteQuestion.mutate(
          {
            questionId: questionId,
          },
          {
            onSuccess: () => {
              queryclient.refetchQueries({
                type: "active",
              });
              toast.success("Success removing question.");
            },

            onError: () => {
              toast.error("Oops! Please try again in a bit 😊");
            },
          },
        );
      }}
    />
  );
}
