/* eslint-disable @typescript-eslint/dot-notation */
"use client";

import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useIsClient } from "usehooks-ts";

type Props = {
  page: number;
};

export default function Pagination({ page }: Props) {
  const router = useRouter();
  const isClient = useIsClient();
  const searchParams = useSearchParams();

  const parsed = qs.parse(searchParams.toString());
  const prevlink = () => {
    const obj = { ...parsed };
    obj["page"] = page <= 1 ? `1` : `${page - 1}`;
    const query = qs.stringify(obj);
    return window.location.pathname + "?" + query;
  };

  const nextLink = () => {
    const obj = { ...parsed };
    obj["page"] = `${page + 1}`;
    const query = qs.stringify(obj);
    return window.location.pathname + "?" + query;
  };

  if (!isClient) return <div></div>;

  return (
    <PaginationContainer>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              "hover:text-primary-500! dark:text-light-700/80 cursor-pointer",
              {
                "disabled pointer-events-none": page <= 1,
              },
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(prevlink());
            }}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            className="text-primary-500 pointer-events-none cursor-default"
            onClick={(e) => e.preventDefault()}
            href="#"
          >
            {page}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            className={cn(
              "hover:text-primary-500! dark:text-light-700/80 cursor-pointer",
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(nextLink());
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationContainer>
  );
}
