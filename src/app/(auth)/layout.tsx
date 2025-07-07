import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <main className="bg-light-850 dark:bg-dark-100 flex min-h-screen w-full items-center justify-center bg-[url(/assets/images/auth-light.png)] bg-cover bg-center bg-no-repeat dark:bg-[url(/assets/images/auth-dark.png)]">
      {children}
    </main>
  );
}
