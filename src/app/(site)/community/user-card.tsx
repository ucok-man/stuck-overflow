import RenderTag from "@/components/render-tag";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/server";
import type { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type Props = {
  user: User;
};

export default async function UserCard({ user }: Props) {
  const toptags = await api.user.getTopTag({ clerkId: user.clerkId, take: 3 });

  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light-100_dark-none max-xs:min-w-full w-full"
    >
      <article className="bg-light-900_dark-200 border-light flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="font-h3-bold text-dark-200_light-900 line-clamp-1">
            {user.name}
          </h3>
          <p className="font-body-regular text-dark-500_light-500 mt-2">
            @{user.username}
          </p>
        </div>

        <div className="mt-5">
          {toptags.length > 0 ? (
            <div className="flex items-center gap-2">
              {toptags.map(({ tag }) => (
                <RenderTag key={tag.id} id={tag.id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge className="font-subtle-medium bg-light-800_dark-300 text-light-400_light-500 rounded-md border-none px-4 py-2">
              No tags yet
            </Badge>
          )}
        </div>
      </article>
    </Link>
  );
}
