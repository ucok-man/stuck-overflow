import ThreeDotLoader from "@/components/three-dot-loader";
import Image from "next/image";

export default function LoadingPage() {
  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex items-center gap-3">
        <Image
          src="/assets/images/site-logo.svg"
          alt="Stuck Overflow"
          width={32}
          height={32}
          className="animate-pulse"
        />
        <h1 className="font-h1-bold text-dark-200 dark:text-light-900 text-2xl">
          Stuck <span className="text-primary-500">Overflow</span>
        </h1>
      </div>

      <ThreeDotLoader size="lg" />

      <p className="text-muted-foreground text-base">Initializing app...</p>
    </div>
  );
}
