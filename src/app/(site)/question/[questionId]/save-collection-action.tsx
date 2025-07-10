"use client";

import Backdrop from "@/components/backdrop";
import { api } from "@/trpc/react";
import { useAuth } from "@clerk/nextjs";
import type { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  questionId: string;
  savedBy: User[];
};

export default function SaveCollectionAction(props: Props) {
  const [isRefreshing, startTransition] = useTransition();
  const router = useRouter();
  const { userId: clerkId } = useAuth();

  const toggleSave = api.question.toggleSaveToCollection.useMutation();
  const queryclient = useQueryClient();

  const handleSave = async () => {
    toggleSave.mutate(
      { questionId: props.questionId },
      {
        onSuccess: () => {
          queryclient.removeQueries({
            type: "active",
          });
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

  const hasSaved = props.savedBy.find((user) => user.clerkId === clerkId);
  const isActionLoading = toggleSave.isPending || isRefreshing;

  return (
    <>
      <Image
        src={
          hasSaved
            ? "/assets/icons/star-filled.svg"
            : "/assets/icons/star-red.svg"
        }
        width={18}
        height={18}
        alt="star"
        className="cursor-pointer"
        onClick={handleSave}
      />

      <Backdrop open={isActionLoading} />
    </>
  );
}
