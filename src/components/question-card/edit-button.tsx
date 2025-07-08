import Image from "next/image";
import Link from "next/link";

type Props = {
  questionId: string;
};

export default function EditButton({ questionId }: Props) {
  return (
    <Link className="cursor-pointer" href={`/question/edit/${questionId}`}>
      <Image
        src="/assets/icons/edit.svg"
        alt="Edit"
        width={14}
        height={14}
        className="object-contain"
      />
    </Link>
  );
}
