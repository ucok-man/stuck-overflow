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
  const toptags = await api.user.getTopTag({ clerkId: user.clerkId });

  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone max-xs:min-w-full xs:w-[260px] w-full"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>

        <div className="mt-5">
          {toptags.length > 0 ? (
            <div className="flex items-center gap-2">
              {toptags.map((tag) => (
                <RenderTag key={tag.id} id={tag.id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
}
