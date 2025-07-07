import { formatAndDivideNumber } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import type { Answer, Question, Tag, User } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import Metric from "../metric";
import RenderTag from "../render-tag";
// import EditDeleteAction from "../shared/EditDeleteAction";
import Image from "next/image";

type Props = {
  question: Question & {
    author: User;
    tags: Tag[];
    upvotes: User[];
    downvotes: User[];
    answers: Answer[];
  };
};

export default async function QuestionCard({ question }: Props) {
  const { userId: clerkId } = await auth();
  const showActionButtons = clerkId && clerkId === question.author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="font-subtle-regular text-dark-400_light-700 line-clamp-1 flex sm:hidden">
            {formatDistanceToNowStrict(question.createdAt)}
          </span>
          <Link href={`/question/${question.id}`}>
            <h3 className="sm:font-h3-semibold font-base-semibold text-dark-200_light-900 line-clamp-1 flex-1">
              {question.title}
            </h3>
          </Link>
        </div>

        <SignedIn>
          {showActionButtons && (
            <Link
              className="cursor-pointer"
              href={`/question/edit/${question.id}`}
            >
              <Image
                src="/assets/icons/edit.svg"
                alt="Edit"
                width={14}
                height={14}
                className="object-contain"
              />
            </Link>
          )}
        </SignedIn>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <RenderTag key={tag.id} id={tag.id} name={tag.name} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={question.author.picture}
          alt="user"
          value={question.author.name}
          title={` - asked ${formatDistanceToNowStrict(question.createdAt)}`}
          href={`/profile/${question.author.id}`}
          isAuthor
          textClass="font-body-medium text-dark-400_light-700"
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatAndDivideNumber(question.upvotes.length)}
            title=" Votes"
            textClass="font-small-medium text-dark-400_light-800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(question.answers.length)}
            title=" Answers"
            textClass="font-small-medium text-dark-400_light-800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(question.views)}
            title=" Views"
            textClass="font-small-medium text-dark-400_light-800"
          />
        </div>
      </div>
    </div>
  );
}
