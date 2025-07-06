import { clsx, type ClassValue } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pushUrlQuery = (params: {
  searchParams: string;
  key: string;
  value: string | null;
}) => {
  const currentUrl = qs.parse(params.searchParams);

  currentUrl[params.key] = params.value;

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
