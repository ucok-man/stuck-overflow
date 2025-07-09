import { Separator } from "@/components/ui/separator";
import type { Answer, User } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import MarkdownRenderer from "./markdown-renderer";
import VotesAction from "./votes-action";

type Props = {
  answer: Answer & { author: User; upvotes: User[]; downvotes: User[] };
};

export default function AnswerCard({ answer }: Props) {
  return (
    <>
      <article className="py-10">
        <section className="mb-8 flex flex-row items-center justify-between gap-5">
          <Link
            href={`/profile/${answer.author.clerkId}`}
            className="flex w-full flex-1 items-center gap-2"
          >
            <Image
              src={answer.author.picture}
              width={24}
              height={24}
              alt="profile"
              className="size-6 shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <p className="font-body-semibold text-dark-300_light-700 line-clamp-1">
                {answer.author.name}
              </p>

              <p className="font-small-regular text-light-400_light-500 line-clamp-1">
                {formatDistanceToNowStrict(answer.createdAt)} ago
              </p>
            </div>
          </Link>

          <div className="flex justify-end">
            <VotesAction
              type="answer"
              itemId={answer.id}
              downvotes={answer.downvotes}
              upvotes={answer.upvotes}
            />
          </div>
        </section>

        <section>
          <MarkdownRenderer html={answer.content} />
        </section>
      </article>

      <Separator className="dark:bg-light-500/50" />
    </>
  );
}
