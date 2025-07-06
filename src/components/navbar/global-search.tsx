"use client";

import { Input } from "@/components/ui/input";
import { pushUrlQuery, removeUrlQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useDebounceValue, useOnClickOutside } from "usehooks-ts";
import GlobalResult from "./global-result";
// import GlobalResult from "./GlobalResult";

export default function GlobalSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get("q"); // default to `q` -> from local search
  const [search, setSearch] = useState(query ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearch] = useDebounceValue(search, 300);

  useOnClickOutside(containerRef as RefObject<HTMLDivElement>, () => {
    setIsOpen(false);
    setSearch("");
  });

  useEffect(() => {
    if (debouncedSearch) {
      const newUrl = pushUrlQuery({
        searchParams: searchParams.toString(),
        key: "global",
        value: debouncedSearch,
      });
      router.push(newUrl, { scroll: false });
    } else {
      const newUrl = removeUrlQuery({
        searchParams: searchParams.toString(),
        keysToRemove: ["global", "type"],
      });
      router.push(newUrl, { scroll: false });
    }
  }, [debouncedSearch, router, pathname, searchParams]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={containerRef}
    >
      <div className="bg-light-800_dark-gradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="mr-1 cursor-pointer"
        />

        <Input
          type="text"
          placeholder="Search Questions / Tags / Users / Answers"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className="font-paragraph-regular no-focus placeholder text-dark-400_light-700 bg-light-850 border-none shadow-none outline-none focus-visible:ring-0"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
}
