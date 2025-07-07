"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn, pushUrlQuery } from "@/lib/utils";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  filters: {
    name: string;
    value: string;
  }[];
  triggerClass?: string;
  containerClass?: string;
  placeholder?: string;
};

export default function LocalMobileFilter(props: Props) {
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
    <div className={cn("relative", props.containerClass)}>
      <Select
        onValueChange={handleClick}
        defaultValue={paramFilter ?? undefined}
      >
        <SelectTrigger
          className={cn(
            "h-[56px]! max-w-sm px-4 py-3",
            "border-light bg-light-800 dark:bg-dark-400/60!",
            "shadow-none",
            props.triggerClass,
          )}
        >
          <div className="flex w-full gap-4">
            <Filter className="text-light-500 mr-1 size-6 flex-shrink-0" />
            {selectedFilter ? (
              <div className="font-paragraph-regular bg-light-850 text-primary/85 dark:bg-dark-400/60 dark:text-light-700 rounded-sm px-2.5 py-1.5 text-sm">
                {selectedFilter.name}
              </div>
            ) : (
              <div className="placeholder font-paragraph-regular bg-light-850 dark:bg-dark-400/60 dark:text-light-700 rounded-sm px-2.5 py-1.5 text-sm">
                Select a filter
              </div>
            )}
          </div>
        </SelectTrigger>

        <SelectContent
          className={cn(
            "dark:bg-dark-300 bg-light-800 border-light",
            "min-w-[var(--radix-select-trigger-width)] p-1",
            "rounded-lg",
            "z-50",
          )}
          align="start"
          sideOffset={8}
        >
          <SelectGroup>
            {props.filters.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className={cn(
                  "flex-between relative cursor-pointer rounded-md px-3 py-3",
                  "font-body-medium dark:text-light-700 text-primary/85",
                  "hover:bg-light-800_dark-400 transition-colors duration-150",
                  "focus:bg-primary-100 dark:focus:bg-primary-500/80",
                  "focus:text-primary-500",
                  "data-[state=checked]:bg-primary-100 dark:data-[state=checked]:bg-primary-500/80",
                  "data-[state=checked]:text-primary-500",
                  "no-focus",
                )}
              >
                <span className="flex-1 text-left">{item.name}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
