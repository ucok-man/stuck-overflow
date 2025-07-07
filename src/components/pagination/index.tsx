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
import { useSearchParams } from "next/navigation";
import qs from "query-string";
import { useIsClient } from "usehooks-ts";

type Props = {
  page: number;
};

export default function Pagination({ page }: Props) {
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
            href={prevlink()}
            className={cn("hover:text-primary-500! dark:text-light-700/80", {
              "disabled pointer-events-none": page <= 1,
            })}
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
            className={cn("hover:text-primary-500! dark:text-light-700/80")}
            href={nextLink()}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationContainer>
  );
}
