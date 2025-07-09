import { api } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import EditForm from "./edit-form";

type Props = {
  params: Promise<{
    questionId: string;
  }>;
};

export default async function EditQuestionPage({ params }: Props) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const { questionId } = await params;
  const question = await api.question.getByIdStrict({ questionId });

  return (
    <div>
      <h1 className="font-h1-bold text-dark-100_light-900">Edit question</h1>

      <div className="mt-9">
        <EditForm question={question} />
      </div>
    </div>
  );
}
