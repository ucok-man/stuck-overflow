"use client";

import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
};

export default function RenderTag({
  id,
  name,
  totalQuestions,
  showCount,
}: Props) {
  const router = useRouter();

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        router.push(`/tags/${id}`);
      }}
      className="z-20 flex justify-between gap-2"
    >
      <Badge className="font-subtle-medium bg-light-800_dark-300 text-light-400_light-500 cursor-pointer rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>

      {showCount && (
        <p className="font-small-medium text-dark-500_light-700">
          {totalQuestions}
        </p>
      )}
    </div>
  );
}
