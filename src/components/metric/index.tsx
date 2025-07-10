"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textClass?: string;
  isAuthor?: boolean;
};

export default function Metric(props: Props) {
  const router = useRouter();

  const metricContent = (
    <>
      <Image
        src={props.imgUrl}
        width={16}
        height={16}
        alt={props.alt}
        className={cn("object-contain", props.href && "rounded-full")}
      />

      <p className={cn(`flex items-center gap-1`, props.textClass)}>
        {props.value}

        <span
          className={cn(
            "font-small-regular line-clamp-1",
            props.isAuthor && "hidden",
          )}
        >
          {props.title}
        </span>
      </p>
    </>
  );

  if (props.href) {
    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          router.push(props.href ?? "");
        }}
        className="flex-center cursor-pointer gap-1"
      >
        {metricContent}
      </div>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
}
