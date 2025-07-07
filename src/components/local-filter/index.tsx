"use client";

import { cn, pushUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

type Props = {
  filters: {
    name: string;
    value: string;
  }[];
  containerClass?: string;
};

export default function LocalFilter(props: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramFilter = searchParams.get("filter");

  const handleClick = (value: string) => {
    const url = pushUrlQuery({
      searchParams: searchParams.toString(),
      items: [
        { key: "filter", value: value },
        { key: "page", value: "1" },
      ],
    });
    router.push(url, { scroll: false });
  };

  const selectedFilter = props.filters.find(
    (filter) => filter.value === paramFilter,
  );

  return (
    <div className={cn("flex w-full flex-wrap gap-3", props.containerClass)}>
      {props.filters.map((item) => (
        <Button
          key={item.value}
          onClick={() => handleClick(item.value)}
          className={cn(
            "font-body-medium cursor-pointer! rounded-lg px-6 py-3 capitalize shadow-none",
            selectedFilter?.value === item.value
              ? "dark:hover:bg-dark-400 bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300",
          )}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
}
