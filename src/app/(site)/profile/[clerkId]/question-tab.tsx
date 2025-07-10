import Pagination from "@/components/pagination";
import QuestionCard from "@/components/question-card";
import { api } from "@/trpc/server";

type Props = {
  clerkId: string;
  page: number;
};

export default async function QuestionTab({ clerkId, page }: Props) {
  const questions = await api.question.getAllByClerkId({
    clerkId: clerkId,
    page: `${page}`,
  });

  return (
    <div className="space-y-3">
      {questions.length > 0 && (
        <>
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}

          <div className="mt-10">
            <Pagination page={page} />
          </div>
        </>
      )}
    </div>
  );
}
