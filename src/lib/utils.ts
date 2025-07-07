import { clsx, type ClassValue } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pushUrlQuery = (params: {
  searchParams: string;
  items: {
    key: string;
    value: string | null;
  }[];
}) => {
  const currentUrl = qs.parse(params.searchParams);

  params.items.forEach((item) => {
    currentUrl[item.key] = item.value;
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
};

export const removeUrlQuery = (params: {
  searchParams: string;
  keysToRemove: string[];
}) => {
  const currentUrl = qs.parse(params.searchParams);

  params.keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
};

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};
