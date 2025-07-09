import LocalSearchBox from "@/components/local-search-box";
import Pagination from "@/components/pagination";
import QuestionCard from "@/components/question-card";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import EmptyState from "./empty-state";

export const metadata: Metadata = {
  title: "Tag | Stuck Overflow",
};

type Props = {
  params: Promise<{
    tagId: string;
  }>;
  searchParams: Promise<{
    query?: string;
    filter?: string;
    page?: string;
  }>;
};

export default async function QuestionsByTagPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const tag = await api.tag.getById({ tagId: params.tagId });
  const questions = await api.question.getAllByTag({
    tagId: params.tagId,
    query: searchParams.query,
    page: searchParams.page,
  });

  return (
    <div>
      <h1 className="font-h1-bold text-dark-100_light-900">#{tag.name}</h1>

      <div className="mt-11 flex w-full flex-col items-start justify-between gap-5">
        <LocalSearchBox
          iconPosition="left"
          placeholder="Search for question"
          containerClass="w-full"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>

      {questions.length > 0 && (
        <div className="mt-10">
          <Pagination
            page={
              isNaN(Number(searchParams.page)) ? 1 : Number(searchParams.page)
            }
          />
        </div>
      )}
    </div>
  );
}
