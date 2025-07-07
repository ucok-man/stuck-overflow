import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src="/assets/images/light-illustration.png"
        alt="No result illustration"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />

      <Image
        src="/assets/images/dark-illustration.png"
        alt="No result illustration"
        width={270}
        height={200}
        className="hidden object-contain dark:flex"
      />

      <h2 className="font-h2-bold text-dark-200_light-900 mt-8">
        There’s no question to show
      </h2>
      <p className="font-body-regular text-dark-500_light-700 my-3.5 max-w-md text-center">
        Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡
      </p>

      <Link href={"/ask-question"}>
        <Button className="font-paragraph-medium bg-primary-500 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900 mt-5 min-h-[46px] rounded-lg px-4 py-3">
          Ask a Question
        </Button>
      </Link>
    </div>
  );
}
