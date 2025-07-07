import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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
      <Link href={props.href} className="flex-center gap-1">
        {metricContent}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
}
