import { Button } from "@/components/ui/button";
import Link from "next/link";

import LocalFilter from "@/components/local-filter";
import LocalMobileFilter from "@/components/local-mobile-filter";
import LocalSearchBox from "@/components/local-search-box";
import { QUESTION_FILTERS } from "@/lib/constants/question-filter";
import type { QuestionFilterType } from "@/lib/types/question-filter-type";
import { api } from "@/trpc/server";
import type { Metadata } from "next";

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
  // const { userId: clerkId } = await auth();

  // let result;

  // if (searchParams?.filter === "recommended") {
  //   if (userId) {
  //     result = await getRecommendedQuestions({
  //       userId,
  //       searchQuery: searchParams.q,
  //       page: searchParams.page ? +searchParams.page : 1,
  //     });
  //   } else {
  //     result = {
  //       questions: [],
  //       isNext: false,
  //     };
  //   }
  // } else {
  //   result = await getQuestions({
  //     searchQuery: searchParams.q,
  //     filter: searchParams.filter,
  //     page: searchParams.page ? +searchParams.page : 1,
  //   });
  // }

  return (
    <div>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-h1-bold text-dark-100_light-900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="bg-primary-gradient !text-light-900 min-h-[46px] px-4 py-3">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex w-full flex-col items-start justify-between gap-5">
        <LocalSearchBox
          iconPosition="left"
          placeholder="Search for questions"
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
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      {/* <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div> */}
    </div>
  );
}
