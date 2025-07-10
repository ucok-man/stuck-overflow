"use client";

import { useTheme } from "next-themes";
import { type ReactNode } from "react";

import { ClerkProvider } from "@clerk/nextjs";
import { dark, experimental__simple } from "@clerk/themes";

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-primary-gradient",
          footerActionLink: "bg-primary-text-gradient hover:text-primary-500",
        },
        baseTheme: theme === "light" ? experimental__simple : dark,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
