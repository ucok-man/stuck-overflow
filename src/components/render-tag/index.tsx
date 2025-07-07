import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
  id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

export default function RenderTag({
  id,
  name,
  totalQuestions,
  showCount,
}: Props) {
  return (
    <Link href={`/tags/${id}`} className="flex justify-between gap-2">
      <Badge className="font-subtle-medium bg-light-800_dark-300 text-light-400_light-500 rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>

      {showCount && (
        <p className="font-small-medium text-dark-500_light-700">
          {totalQuestions}
        </p>
      )}
    </Link>
  );
}
