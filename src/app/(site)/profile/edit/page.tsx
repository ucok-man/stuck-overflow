import { api } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditForm from "./edit-form";

export default async function EditProfilePage() {
  const { userId: clerkId } = await auth();
  const user = await api.user.getByClerkId({ clerkId: clerkId! });

  return (
    <div>
      <div className="flex items-center gap-6">
        <Link
          href={`/profile/${clerkId}`}
          className="text-primary-500 flex items-center justify-center gap-1"
        >
          <ArrowLeft /> <span>Back</span>
        </Link>
        <h1 className="font-h1-bold text-dark-100_light-900">Edit Profile</h1>
      </div>

      <div className="mt-9">
        <EditForm user={user} />
      </div>
    </div>
  );
}
