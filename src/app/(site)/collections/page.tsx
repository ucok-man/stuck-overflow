import LocalFilter from "@/components/local-filter";
import LocalMobileFilter from "@/components/local-mobile-filter";
import LocalSearchBox from "@/components/local-search-box";
import Pagination from "@/components/pagination";
import { COLLECTION_FILTERS } from "@/lib/constants/collection-filter";
import type { CollectionFilterType } from "@/lib/types/collection-filter-type";
import { api } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import EmptyState from "./empty-state";
import QuestionCard from "./question-card";

type Props = {
  searchParams: Promise<{
    query?: string;
    filter?: string;
    page?: string;
  }>;
};

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams;
  const { userId: clerkId } = await auth();

  const questions = await api.question.getCollection({
    query: searchParams.query,
    filter: COLLECTION_FILTERS.find((val) => val.value === searchParams.filter)
      ?.value as CollectionFilterType | undefined,
    page: searchParams.page,
  });

  return (
    <div>
      <h1 className="font-h1-bold text-dark-100_light-900">Saved Questions</h1>

      <div className="mt-11 flex w-full flex-col items-start justify-between gap-5">
        <LocalSearchBox
          iconPosition="left"
          placeholder="Search for questions"
          containerClass="w-full"
        />

        <LocalMobileFilter
          filters={COLLECTION_FILTERS}
          containerClass="md:hidden flex max-sm:w-full"
        />
        <LocalFilter
          filters={COLLECTION_FILTERS}
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
}
