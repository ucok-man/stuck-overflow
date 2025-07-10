import { Button } from "@/components/ui/button";
import Link from "next/link";

import LocalFilter from "@/components/local-filter";
import LocalMobileFilter from "@/components/local-mobile-filter";
import LocalSearchBox from "@/components/local-search-box";
import Pagination from "@/components/pagination";
import QuestionCard from "@/components/question-card";
import { QUESTION_FILTERS } from "@/lib/constants/question-filter";
import type { QuestionFilterType } from "@/lib/types/question-filter-type";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import EmptyState from "./empty-state";

export const metadata: Metadata = {
  title: "Home | Stuck Overflow",
};

type Props = {
  searchParams: Promise<{
    query?: string;
    filter?: string;
    page?: string;
  }>;
};

export default async function HomePage(props: Props) {
  const searchParams = await props.searchParams;

  const questions = await api.question.getAll({
    query: searchParams.query,
    filter: QUESTION_FILTERS.find((val) => val.value === searchParams.filter)
      ?.value as QuestionFilterType | undefined,
    page: searchParams.page,
  });

  return (
    <div>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-h1-bold text-dark-100_light-900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="bg-primary-gradient !text-light-900 min-h-[46px] cursor-pointer px-4 py-3">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex w-full flex-col items-start justify-between gap-5">
        <LocalSearchBox
          iconPosition="left"
          placeholder="Search for question"
          containerClass="w-full"
        />

        <LocalMobileFilter
          filters={QUESTION_FILTERS}
          containerClass="md:hidden flex max-sm:w-full"
        />
        <LocalFilter
          filters={QUESTION_FILTERS}
          containerClass="hidden md:flex"
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

  // return <div>{JSON.stringify(searchParams)}</div>;
}
