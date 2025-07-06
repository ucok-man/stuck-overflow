"use client";

import { GLOBAL_FILTERS } from "@/lib/constants/global-filter";
import { pushUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function GlobalFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");

  const [active, setActive] = useState(typeParams ?? "");

  const handleClick = (item: string) => {
    /* --------------------- toogle active filter --------------------- */

    if (active === item) {
      setActive("");

      const url = pushUrlQuery({
        searchParams: searchParams.toString(),
        items: [
          {
            key: "type",
            value: null,
          },
        ],
      });

      router.push(url, { scroll: false });
    } else {
      setActive(item);

      const url = pushUrlQuery({
        searchParams: searchParams.toString(),
        items: [
          {
            key: "type",
            value: item.toLowerCase(),
          },
        ],
      });

      router.push(url, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark-400_light-900 font-body-medium">Type: </p>
      <div className="flex gap-3">
        {GLOBAL_FILTERS.map((item) => (
          <button
            type="button"
            key={item.value}
            className={`light-border-2 font-small-medium dark:text-light-800 dark:hover:text-primary-500 cursor-pointer rounded-2xl px-5 py-2 capitalize ${
              active === item.value
                ? "bg-primary-500 text-light-900 dark:hover:text-light-800!"
                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"
            } `}
            onClick={() => handleClick(item.value)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
