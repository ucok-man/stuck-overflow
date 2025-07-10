import LocalFilter from "@/components/local-filter";
import LocalMobileFilter from "@/components/local-mobile-filter";
import LocalSearchBox from "@/components/local-search-box";
import Pagination from "@/components/pagination";
import { USER_FILTERS } from "@/lib/constants/user-filter";
import type { UserFilterType } from "@/lib/types/user-filter-type";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import EmptyState from "./empty-state";
import UserCard from "./user-card";

export const metadata: Metadata = {
  title: "Community | Stuck Overflow",
};

type Props = {
  searchParams: Promise<{
    query?: string;
    filter?: string;
    page?: string;
  }>;
};

export default async function CommunityPage(props: Props) {
  const searchParams = await props.searchParams;

  const users = await api.user.getAll({
    query: searchParams.query,
    filter: USER_FILTERS.find((val) => val.value === searchParams.filter)
      ?.value as UserFilterType | undefined,
    page: searchParams.page,
    pageSize: "9",
  });

  return (
    <div>
      <h1 className="font-h1-bold text-dark-100_light-900">All Users</h1>

      <div className="mt-11 flex w-full flex-col items-start justify-between gap-5">
        <LocalSearchBox
          iconPosition="left"
          placeholder="Search for a user"
          containerClass="w-full"
        />

        <LocalMobileFilter
          filters={USER_FILTERS}
          containerClass="md:hidden flex max-sm:w-full"
        />
        <LocalFilter filters={USER_FILTERS} containerClass="hidden md:flex" />
      </div>

      <section
        className={cn(
          "mt-10 w-full",
          users.length
            ? "grid grid-cols-1 gap-4 min-[520]:grid-cols-2! min-[1200]:grid-cols-3!"
            : "flex flex-col",
        )}
      >
        {users.length > 0 ? (
          users.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <EmptyState />
        )}
      </section>

      {users.length > 0 && (
        <div className="mt-10">
          <Pagination
            page={
              isNaN(Number(searchParams.page)) ? 1 : Number(searchParams.page)
            }
          />
        </div>
      )}
    </div>
  );
}
