"use client";

import { Input } from "@/components/ui/input";
import { cn, pushUrlQuery, removeUrlQuery } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

type Props = {
  iconPosition: "left" | "right";
  placeholder: string;
  containerClass?: string;
};

export default function LocalSearchBox(props: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("query");
  const [search, setSearch] = useState(query ?? "");
  const [debouncedSearch] = useDebounceValue(search, 300);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      const url = pushUrlQuery({
        searchParams: searchParams.toString(),
        items: [
          {
            key: "query",
            value: debouncedSearch,
          },
          {
            key: "page",
            value: "1",
          },
        ],
      });
      router.push(url, { scroll: false });
      return;
    }

    if (!searchParams.get("filter")) {
      const url = removeUrlQuery({
        searchParams: searchParams.toString(),
        keysToRemove: ["query", "page"],
      });
      router.push(url, { scroll: false });
      return;
    }

    const url = removeUrlQuery({
      searchParams: searchParams.toString(),
      keysToRemove: ["query"],
    });
    router.push(url, { scroll: false });
  }, [debouncedSearch]);

  return (
    <div
      className={cn(
        "bg-light-800_dark-300 flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4",
        props.containerClass,
      )}
    >
      {props.iconPosition === "left" && (
        <Search className="text-light-500 size-7 flex-shrink-0" />
      )}

      <Input
        type="text"
        placeholder={props.placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="font-paragraph-regular no-focus text-dark-400_light-700 bg-light-850 border-none shadow-none outline-none focus-visible:ring-0"
      />

      {props.iconPosition === "right" && (
        <Search className="text-light-500 size-7 flex-shrink-0" />
      )}
    </div>
  );
}
