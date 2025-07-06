import Image from "next/image";
import Link from "next/link";
// import GlobalSearch from "../search/GlobalSearch";
import AuthButton from "./auth-button";
import GlobalSearch from "./global-search";
import MobileNavbar from "./mobile-navbar";
import ThemeSwitcher from "./theme-switcher";

export default function Navbar() {
  return (
    <nav className="flex-between bg-light-900_dark-200 shadow-light-200 fixed z-50 w-full gap-5 p-6 sm:px-12 dark:shadow-none">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt="Stuck Overflow"
        />

        <p className="font-h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Stuck <span className="text-primary-500">Overflow</span>
        </p>
      </Link>

      <GlobalSearch />

      <div className="flex-between gap-5">
        <ThemeSwitcher />

        <AuthButton />

        <MobileNavbar />
      </div>
    </nav>
  );
}
