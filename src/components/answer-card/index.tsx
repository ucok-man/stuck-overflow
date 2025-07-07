import Metric from "@/components/metric";
import { formatAndDivideNumber } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import type { Answer, Question, User } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import DeleteAction from "./delete-action";

type Props = {
  answer: Answer & {
    upvotes: User[];
    downvotes: User[];
    author: User;
    question: Question;
  };
};

export default async function AnswerCard({ answer }: Props) {
  const { userId: clerkId } = await auth();
  const showActionButtons = clerkId && clerkId === answer.author.clerkId;

  return (
    <Link
      href={`/question/${answer.question.id}`}
      className="card-wrapper rounded-[10px] px-11 py-9"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="font-subtle-regular text-dark-400_light-700 line-clamp-1 flex sm:hidden">
            {formatDistanceToNowStrict(answer.createdAt)}
          </span>
          <h3 className="sm:font-h3-semibold font-base-semibold text-dark-200_light-900 line-clamp-1 flex-1">
            {answer.question.title}
          </h3>
        </div>

        <SignedIn>
          {showActionButtons && <DeleteAction answerId={answer.id} />}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={answer.author.picture}
          alt="user avatar"
          value={answer.author.name}
          title={` • asked ${formatDistanceToNowStrict(answer.createdAt)}`}
          href={`/profile/${answer.author.clerkId}`}
          textClass="font-body-medium text-dark-400_light-700"
          isAuthor
        />

        <div className="flex-center gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="like icon"
            value={formatAndDivideNumber(answer.upvotes.length)}
            title=" Votes"
            textClass="font-small-medium text-dark-400_light-800"
          />
        </div>
      </div>
    </Link>
  );
}
