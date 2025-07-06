"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { THEMES } from "@/lib/constants/themes";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Menubar className="relative border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200 cursor-pointer">
          {theme === "light" ? (
            <Image
              src="/assets/icons/sun.svg"
              alt="sun"
              width={20}
              height={20}
              className="active-theme"
            />
          ) : (
            <Image
              src="/assets/icons/moon.svg"
              alt="moon"
              width={20}
              height={20}
              className="active-theme"
            />
          )}
        </MenubarTrigger>
        <MenubarContent className="bg-light-900 dark:border-dark-400 dark:bg-dark-300 absolute right-[-3rem] mt-3 min-w-[120px] rounded border py-2">
          {THEMES.map((item) => (
            <MenubarItem
              key={item.value}
              className="dark:focus:bg-dark-400 flex cursor-pointer items-center gap-4 px-2.5 py-2"
              onClick={() => {
                setTheme(item.value);
              }}
            >
              <Image
                src={item.icon}
                alt={item.value}
                width={16}
                height={16}
                className={`${theme === item.value && "active-theme"}`}
              />
              <p
                className={`font-body-semibold text-light-500 ${theme === item.value ? "text-primary-500" : "text-dark-100_light-900"}`}
              >
                {item.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
