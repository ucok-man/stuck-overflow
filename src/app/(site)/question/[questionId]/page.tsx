import Metric from "@/components/metric";
import RenderTag from "@/components/render-tag";
import { Separator } from "@/components/ui/separator";
import { formatAndDivideNumber } from "@/lib/utils";
import { api } from "@/trpc/server";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import AnswerForm from "./answer-form";
import AnswerList from "./answer-list";
import MarkdownRenderer from "./markdown-renderer";
import SaveCollectionAction from "./save-collection-action";
import VotesAction from "./votes-action";

type Props = {
  params: Promise<{
    questionId: string;
  }>;
  searchParams: Promise<{
    filter?: string;
    page?: string;
  }>;
};

export default async function QuestionDetailPage(props: Props) {
  const searchParams = await props.searchParams;
  const { questionId } = await props.params;

  const question = await api.question.getById({ questionId });
  await api.question.incrementView({ questionId: question.id });

  return (
    <div>
      <section className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={question.author.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="font-paragraph-semibold text-dark-300_light-700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <div className="flex gap-5">
              <VotesAction
                type="question"
                itemId={question.id}
                downvotes={question.downvotes}
                upvotes={question.upvotes}
              />
              <SaveCollectionAction
                questionId={question.id}
                savedBy={question.savedBy}
              />
            </div>
          </div>
        </div>
        <h2 className="font-h2-semibold text-dark-200_light-900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </section>

      <section className="mt-5 mb-8 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${formatDistanceToNowStrict(question.createdAt)}`}
          title=" Asked"
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
      </section>

      <section>
        <MarkdownRenderer html={question.content} />
      </section>

      <section className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <RenderTag
            key={tag.id}
            id={tag.id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </section>

      <Separator className="dark:bg-light-500/50 my-8" />

      <section className="mb-8">
        <AnswerList questionId={questionId} searchParams={searchParams} />
      </section>

      <section>
        <AnswerForm question={question} />
      </section>
    </div>
  );
}
