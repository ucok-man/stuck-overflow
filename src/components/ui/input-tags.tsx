"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import * as React from "react";

type InputTagsProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> & {
  value: string[];
  onChange: (value: string[]) => void;
  inputClass?: string;
  badgeClass?: string;
  maxItem?: number;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  (
    {
      className,
      inputClass,
      badgeClass,
      value,
      onChange,
      placeholder,
      maxItem,
      ...props
    },
    ref,
  ) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint
            .toUpperCase()
            .split(",")
            .map((chunk) => chunk.trim())
            .filter((chunk) => chunk.length > 0), // Filter out empty strings
        ]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      const trimmedValue = pendingDataPoint.trim().toUpperCase();
      if (trimmedValue && !value.includes(trimmedValue)) {
        const newDataPoints = new Set([...value, trimmedValue]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    const removePendingDataPoint = () => {
      setPendingDataPoint("");
    };

    const removeTag = (tagToRemove: string) => {
      onChange(value.filter((item) => item !== tagToRemove));
    };

    const removeLastTag = () => {
      if (value.length > 0) {
        onChange(value.slice(0, -1));
      }
    };

    const disabled = maxItem ? value.length >= maxItem : false;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addPendingDataPoint();
      } else if (
        e.key === "Backspace" &&
        pendingDataPoint.length === 0 &&
        value.length > 0
      ) {
        e.preventDefault();
        removeLastTag();
      } else if (e.key === "Escape") {
        removePendingDataPoint();
      }
    };

    return (
      <div
        className={cn(
          // caveat: :has() variant requires tailwind v3.4 or above: https://tailwindcss.com/blog/tailwindcss-v3-4#new-has-variant
          "flex min-h-[36px] w-full flex-wrap gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-neutral-950 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:has-[:focus-visible]:ring-neutral-300",
          className,
        )}
        aria-disabled={disabled}
      >
        {value.map((item) => (
          <Badge key={item} variant="secondary" className={cn(badgeClass)}>
            {item}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hover:text-primary-500 ml-2 h-3 w-3 cursor-pointer transition-all"
              onClick={() => removeTag(item)}
              tabIndex={-1}
            >
              <XIcon className="w-3" />
            </Button>
          </Badge>
        ))}
        <input
          placeholder={disabled ? "" : placeholder}
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={handleKeyDown}
          {...props}
          className={cn(
            "flex-1 outline-0 placeholder:text-neutral-500 dark:placeholder:text-neutral-400",
            inputClass,
          )}
          ref={ref}
          disabled={disabled}
        />
      </div>
    );
  },
);

InputTags.displayName = "InputTags";

export { InputTags };
