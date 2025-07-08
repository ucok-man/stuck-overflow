import LocalFilter from "@/components/local-filter";
import LocalMobileFilter from "@/components/local-mobile-filter";
import LocalSearchBox from "@/components/local-search-box";
import Pagination from "@/components/pagination";
import { TAG_FILTERS } from "@/lib/constants/tag-filter";
import type { TagFilterType } from "@/lib/types/tag-filter-type";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import EmptyState from "./empty-state";
import TagCard from "./tag-card";

export const metadata: Metadata = {
  title: "Tag | Stuck Overflow",
};

type Props = {
  searchParams: Promise<{
    query?: string;
    filter?: string;
    page?: string;
  }>;
};

export default async function TagsPage(props: Props) {
  const searchParams = await props.searchParams;

  const tags = await api.tag.getAll({
    query: searchParams.query,
    filter: TAG_FILTERS.find((val) => val.value === searchParams.filter)
      ?.value as TagFilterType | undefined,
    page: searchParams.page,
  });

  return (
    <div>
      <h1 className="font-h1-bold text-dark-100_light-900">All Tags</h1>

      <div className="mt-11 flex w-full flex-col items-start justify-between gap-5">
        <LocalSearchBox
          iconPosition="left"
          placeholder="Search for a tag"
          containerClass="w-full"
        />

        <LocalMobileFilter
          filters={TAG_FILTERS}
          containerClass="md:hidden flex max-sm:w-full"
        />
        <LocalFilter filters={TAG_FILTERS} containerClass="hidden md:flex" />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {tags.length > 0 ? (
          tags.map((tag) => <TagCard key={tag.id} tag={tag} />)
        ) : (
          <EmptyState />
        )}
      </div>

      {tags.length > 0 && (
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
