import AnswerCard from "@/components/answer-card";
import Pagination from "@/components/pagination";
import { api } from "@/trpc/server";

type Props = {
  clerkId: string;
  page: number;
};

export default async function AnswerTab({ clerkId, page }: Props) {
  const answers = await api.answer.getAllByClerkId({
    clerkId: clerkId,
    page: `${page}`,
  });

  return (
    <div className="space-y-3">
      {answers.length > 0 && (
        <>
          {answers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}

          <div className="mt-10">
            <Pagination page={page} />
          </div>
        </>
      )}
    </div>
  );
}
