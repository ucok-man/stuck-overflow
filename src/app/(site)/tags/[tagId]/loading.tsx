import ThreeDotLoader from "@/components/three-dot-loader";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-168px)] w-full items-center justify-center rounded">
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/assets/images/site-logo.svg"
            width={23}
            height={23}
            alt="Stuck Overflow"
            className="relative top-[1.6px]"
          />
          <p className="font-h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
            Stuck <span className="text-primary-500">Overflow</span>
          </p>
        </div>

        <ThreeDotLoader size="lg" />
        <p className="text-muted-foreground text-sm">Preparing resources</p>
      </div>
    </div>
  );
}
