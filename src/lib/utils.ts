import { clsx, type ClassValue } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import {
  BADGE_CRITERIA,
  type BADGE_CRITERIA_ENUM,
} from "./constants/badge-criteria";

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

export const shuffle = <T>(input: T[]): T[] => {
  const array = [...input];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
  return array;
};

export type CalculateBadgeParam = {
  criterias: {
    type: BADGE_CRITERIA_ENUM;
    count: number;
  }[];
};

export const calculateBadge = ({ criterias }: CalculateBadgeParam) => {
  const badge = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  criterias.forEach((criteria) => {
    const levelrule = BADGE_CRITERIA[criteria.type];
    for (const key in levelrule) {
      const level = key as keyof typeof levelrule;

      if (criteria.count > levelrule[level]) {
        badge[level] += 1;
      }
    }
  });

  return badge;
};
