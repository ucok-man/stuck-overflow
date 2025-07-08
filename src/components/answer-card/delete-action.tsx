/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";

import { api } from "@/trpc/react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";

type Props = {
  answerId: string;
};

export default function DeleteAction({ answerId }: Props) {
  const deleteAnswer = api.answer.delete.useMutation();
  const queryClient = useQueryClient();

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={() => {
          deleteAnswer.mutate(
            { answerId },
            {
              onSuccess: () => {
                queryClient.refetchQueries({
                  type: "active",
                });
                toast.success("Success deleting answer.");
              },
              onError: () => {
                toast.error(
                  "Sorry we have problem in our server. Please try again later!",
                );
              },
            },
          );
        }}
      />
    </div>
  );
}
