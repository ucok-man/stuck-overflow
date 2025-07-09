import LocalMobileFilter from "@/components/local-mobile-filter";
import Pagination from "@/components/pagination";
import { ANSWER_FILTERS } from "@/lib/constants/answer-filter";
import type { AnswerFilterType } from "@/lib/types/answer-filter-type";
import { api } from "@/trpc/server";
import AnswerCard from "./answer-card";

interface Props {
  questionId: string;
  searchParams: {
    page?: string;
    filter?: string;
  };
}

export default async function AnswerList(props: Props) {
  const answers = await api.answer.getAll({
    questionId: props.questionId,
    filter: ANSWER_FILTERS.find(
      (val) => val.value === props.searchParams.filter,
    )?.value as AnswerFilterType | undefined,
    page: props.searchParams.page,
  });

  return (
    <div className="">
      <section className="mb-4 flex flex-row items-center justify-between">
        <h3 className="bg-primary-text-gradient">
          <span className="max-xs:hidden">All </span> Answers
        </h3>

        <LocalMobileFilter
          containerClass=""
          triggerClass="bg-transparent! dark:bg-transparent! border-none! focus-visible:ring-0 focus-visible:outline-0 p-0 [&_div_svg]:max-xs:hidden [&_div]:gap-2 [&_div_div]:bg-light-800"
          filters={ANSWER_FILTERS}
        />
      </section>

      {answers.length > 0 ? (
        <>
          <section>
            {answers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))}
          </section>

          <section className="mt-10 w-full">
            <Pagination
              page={
                isNaN(Number(props.searchParams.page))
                  ? 1
                  : Number(props.searchParams.page)
              }
            />
          </section>
        </>
      ) : (
        <div className="flex w-full items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-2.5 text-center">
            <h3 className="text-dark-200_light-900 text-lg font-semibold">
              No answers have been posted yet.
            </h3>
            <p className="text-muted-foreground text-sm">
              Be the first to contribute a helpful response!
            </p>
            <div className="text-2xl">
              <span role="img" aria-label="worried face">
                😟
              </span>
              <span role="img" aria-label="worried face">
                😟
              </span>
              <span role="img" aria-label="worried face">
                😟
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
