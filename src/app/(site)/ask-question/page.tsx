import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateForm from "./create-form";

export default async function AskQuestionPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  return (
    <div>
      <h1 className="font-h1-bold text-dark-100_light-900">Ask a question</h1>

      <div className="mt-9">
        <CreateForm />
      </div>
    </div>
  );
}
