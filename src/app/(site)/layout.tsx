import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function SiteLayout({ children }: Props) {
  return (
    <main className="bg-light-850_dark-100 relative">
      {/* <Navbar /> */}
      <div className="flex">
        {/* <LeftSidebar /> */}

        <section className="flex min-h-screen flex-1 flex-col px-6 pt-36 pb-6 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>

        {/* <RightSidebar /> */}
      </div>

      {/* <Toaster /> */}
    </main>
  );
}
