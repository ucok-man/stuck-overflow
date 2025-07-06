"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MOBILE_NAV_LINKS } from "@/lib/constants/mobile-nav-links";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DialogDescription, DialogTitle } from "../ui/dialog";

export default function MobileNavbar() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          width={36}
          height={36}
          alt="Menu"
          className="invert-colors cursor-pointer sm:hidden"
        />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="bg-light-900_dark-200 no-scrollbar overflow-y-auto border-none"
      >
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />

        <SheetHeader>
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/assets/images/site-logo.svg"
              width={23}
              height={23}
              alt="Stuck Overflow"
            />

            <p className="font-h2-bold text-dark-100_light-900 font-space-grotesk">
              Stuck <span className="text-primary-500">Overflow</span>
            </p>
          </Link>
        </SheetHeader>

        <div className="no-scrollbar flex grow flex-col justify-between overflow-y-auto">
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6 pt-16">
              {MOBILE_NAV_LINKS.map((item) => {
                const isActive =
                  (pathname.includes(item.route) && item.route.length > 1) ||
                  pathname === item.route;

                return (
                  <SheetClose asChild key={item.route}>
                    <Link
                      href={item.route}
                      className={` ${
                        isActive
                          ? "bg-primary-gradient text-light-900 rounded-lg"
                          : "text-dark-300_light-900"
                      } flex items-center justify-start gap-4 bg-transparent p-4`}
                    >
                      <Image
                        src={item.imgURL}
                        alt={item.label}
                        width={20}
                        height={20}
                        className={`${isActive ? "" : "invert-colors"}`}
                      />
                      <p
                        className={`${isActive ? "font-bold" : "font-medium"}`}
                      >
                        {item.label}
                      </p>
                    </Link>
                  </SheetClose>
                );
              })}
            </section>
          </SheetClose>
        </div>

        <SheetFooter>
          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link href="/sign-in">
                  <Button className="font-small-medium !btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className="bg-primary-text-gradient">Log In</span>
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/sign-up">
                  <Button className="font-small-medium border-light-2 !btn-tertiary text-dark-400_light-900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
