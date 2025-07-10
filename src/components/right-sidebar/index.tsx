import { api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import RenderTag from "../render-tag";

export default async function RightSidebar() {
  console.log("RUN RIGHT SIDEBAR");
  const questions = await api.question.getAll({
    filter: "most_upvotes",
    pageSize: "5",
  });
  const tags = await api.tag.getAll({
    filter: "popular",
    pageSize: "5",
  });

  return (
    <section className="bg-light-900_dark-200 border-light custom-scrollbar shadow-light-300 sticky top-0 right-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 max-xl:hidden dark:shadow-none">
      <div>
        <h3 className="font-h3-bold text-dark-200_light-900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {questions.map((question) => (
            <Link
              href={`/question/${question.id}`}
              key={question.id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="font-body-medium text-dark-500_light-700">
                {question.title}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="font-h3-bold text-dark-200_light-900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {tags.map((tag) => (
            <RenderTag
              key={tag.id}
              id={tag.id}
              name={tag.name}
              totalQuestions={tag._count.questions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
}
