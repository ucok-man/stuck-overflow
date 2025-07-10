/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";

import Backdrop from "@/components/backdrop";
import { formatAndDivideNumber } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useAuth } from "@clerk/nextjs";
import type { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  type: "question" | "answer";
  itemId: string;
  upvotes: User[];
  downvotes: User[];
};

export default function VotesAction(props: Props) {
  const { userId: clerkId } = useAuth();
  const [isRefreshing, startTransition] = useTransition();
  const router = useRouter();

  const queryclient = useQueryClient();
  const questionUpvote = api.question.toggleUpvote.useMutation();
  const questionDownvote = api.question.toggleDownvote.useMutation();
  const answerUpvote = api.answer.toggleUpvote.useMutation();
  const answerDownvote = api.answer.toggleDownvote.useMutation();

  const isActionLoading =
    questionUpvote.isPending ||
    questionDownvote.isPending ||
    answerUpvote.isPending ||
    answerDownvote.isPending ||
    isRefreshing;

  const handleVote = async (action: "upvote" | "downvote") => {
    if (!clerkId) {
      toast.error("You must be logged in to perform this action");
      return;
    }
    if (props.type === "question") {
      switch (action) {
        case "upvote": {
          questionUpvote.mutate(
            {
              questionId: props.itemId,
            },
            {
              onSuccess: () => {
                queryclient.refetchQueries({
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
          return;
        }

        default: {
          questionDownvote.mutate(
            {
              questionId: props.itemId,
            },
            {
              onSuccess: () => {
                queryclient.refetchQueries({
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
          return;
        }
      }
    }

    if (props.type === "answer") {
      switch (action) {
        case "upvote": {
          answerUpvote.mutate(
            {
              answerId: props.itemId,
            },
            {
              onSuccess: () => {
                queryclient.refetchQueries({
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
          return;
        }

        default: {
          answerDownvote.mutate(
            {
              answerId: props.itemId,
            },
            {
              onSuccess: () => {
                queryclient.refetchQueries({
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
          return;
        }
      }
    }
  };

  const hasUpvoted = props.upvotes.find((user) => user.clerkId === clerkId);
  const hasDownvoted = props.downvotes.find((user) => user.clerkId === clerkId);

  return (
    <>
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center bg-light-700_dark-400 min-w-[18px] rounded-sm p-1">
            <p className="font-subtle-medium text-dark-400_light-900">
              {formatAndDivideNumber(props.upvotes.length)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center bg-light-700_dark-400 min-w-[18px] rounded-sm p-1">
            <p className="font-subtle-medium text-dark-400_light-900">
              {formatAndDivideNumber(props.downvotes.length)}
            </p>
          </div>
        </div>
      </div>

      <Backdrop open={isActionLoading} />
    </>
  );
}
