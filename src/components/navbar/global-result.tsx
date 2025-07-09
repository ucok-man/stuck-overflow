"use client";

import type { GlobalFilterType } from "@/lib/types/global-filter-type";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GlobalFilter from "./global-filter";

export default function GlobalResult() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const type = searchParams.get("type") as GlobalFilterType | null;

  const { data, isPending, error } = api.common.search.useQuery({
    query: search,
    type: type,
  });

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/question/${id}`;
      case "answer":
        return `/question/${id}`;
      case "user":
        return `/profile/${id}`;
      case "tag":
        return `/tags/${id}`;
      default:
        return "/";
    }
  };

  const Content = () => {
    if (isPending) {
      return (
        <div className="flex-center flex-col px-5">
          <Loader2 className="text-primary-500 my-2 h-10 w-10 animate-spin" />
          <p className="text-dark-200_light-800 font-body-regular">
            Wait for a moment...
          </p>
        </div>
      );
    }

    if (data?.length) {
      return (
        <div className="flex flex-col gap-2">
          {data.map((item, idx) => (
            <Link
              href={renderLink(item.type, item.id)}
              key={item.type + item.id + idx}
              className="hover:bg-light-700/50 dark:bg-dark-500/50 flex w-full cursor-pointer items-start gap-3 px-5 py-2.5"
            >
              <Image
                src="/assets/icons/tag.svg"
                alt="tags"
                width={18}
                height={18}
                className="invert-colors mt-1 object-contain"
              />

              <div className="flex flex-col">
                <p className="font-body-medium text-dark-200_light-800 line-clamp-1">
                  {item.content}
                </p>
                <p className="text-light-400_light-500 small-medium mt-1 font-bold capitalize">
                  {item.type}
                </p>
              </div>
            </Link>
          ))}
        </div>
      );
    }

    return (
      <div className="flex-center flex-col px-5">
        <p className="text-dark-200_light-800 font-body-regular px-5 py-2.5">
          Oops, no results found
        </p>
      </div>
    );
  };

  return (
    <div className="bg-light-800 dark:bg-dark-400 absolute top-full z-10 mt-3 w-full rounded-xl py-5 shadow-sm">
      <GlobalFilter />
      <div className="bg-light-700/50 dark:bg-dark-500/50 my-5 h-[1px]" />

      <div className="space-y-5">
        <p className="text-dark-400_light-900 font-paragraph-semibold px-5">
          Top Match
        </p>

        <Content />
      </div>
    </div>
  );
}
