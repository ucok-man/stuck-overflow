import "@/styles/globals.css";

import { type Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import AuthProvider from "./_providers/auth-provider";
import ThemeProvider from "./_providers/theme-provider";

export const metadata: Metadata = {
  title: "Stuck Overflow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <Toaster theme="system" className="" />
            </AuthProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
