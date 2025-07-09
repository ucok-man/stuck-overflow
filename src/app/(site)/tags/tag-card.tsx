import type { Tag } from "@prisma/client";
import Link from "next/link";

type Props = {
  tag: Tag & {
    _count: {
      questions: number;
    };
  };
};

export default function TagCard({ tag }: Props) {
  return (
    <Link href={`/tags/${tag.id}`} className="shadow-light-100 w-full">
      <article className="bg-light-900_dark-200 border-light flex w-full flex-col rounded-2xl border px-8 py-10">
        <div className="bg-light-800_dark-400 w-fit rounded-sm px-5 py-1.5">
          <p className="font-paragraph-semibold text-dark-300_light-900 line-clamp-1">
            {tag.name}
          </p>
        </div>

        <p className="font-small-medium text-dark-400_light-500 mt-3.5">
          <span className="font-body-semibold bg-primary-text-gradient mr-2.5">
            {tag._count.questions}+
          </span>{" "}
          Questions
        </p>
      </article>
    </Link>
  );
}
