"use client";

import { SIDEBAR_LINKS } from "@/lib/constants/sidebar-links";
import { cn } from "@/lib/utils";
import { SignedOut, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function LeftSidebar() {
  const { userId: clerkId } = useAuth();
  const pathname = usePathname();

  return (
    <section className="bg-light-900_dark-200 border-light custom-scrollbar shadow-light-300 sticky top-0 left-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 max-sm:hidden lg:w-[266px] dark:shadow-none">
      <div className="flex flex-1 flex-col gap-6">
        {SIDEBAR_LINKS.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          if (item.route === "/profile" && !clerkId) return null;

          return (
            <Link
              href={
                item.route === "/profile"
                  ? `${item.route}/${clerkId}`
                  : item.route
              }
              key={item.label}
              className={cn(
                "text-dark-300_light-900 flex items-center justify-start gap-4 bg-transparent p-4",
                isActive && "bg-primary-gradient text-light-900 rounded-lg",
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive && "invert-colors"}`}
              />
              <p
                className={`${isActive ? "font-base-bold" : "font-base-medium"} max-lg:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>

      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href="/sign-in">
            <Button className="font-small-medium !btn-secondary min-h-[41px] w-full cursor-pointer rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/account.svg"
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="bg-primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button className="font-small-medium border-light-2 !btn-tertiary text-dark-400_light-900 min-h-[41px] w-full cursor-pointer rounded-lg border px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/sign-up.svg"
                alt="sign up"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden">Sign up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
}
