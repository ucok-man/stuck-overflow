"use client";

import ThreeDotLoader from "@/components/three-dot-loader";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SyncUserPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  const syncAction = api.user.sync.useMutation({
    onSuccess: () => {
      router.replace("/");
    },
    onError: () => {
      toast.error("Oops! Something went wrong. Please try again later.");
      router.replace("/sign-in");
    },
  });

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    // Avoid re-syncing if already loading or done
    if (!syncAction.isPending && !syncAction.isSuccess && !syncAction.isError) {
      syncAction.mutate({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        name: user.fullName ?? "Unknown",
        username:
          user.fullName?.toLowerCase().split(" ").join("_") ?? "unknown_user",
        picture: user.imageUrl,
      });
    }
  }, [isLoaded, user, router, syncAction]);

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

      <p className="text-muted-foreground text-base">
        Preparing your account...
      </p>
    </div>
  );
}
