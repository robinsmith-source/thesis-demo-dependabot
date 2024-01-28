import { api } from "~/trpc/server";
import QueryPagination from "~/app/_components/search/QueryPagination";
import UserCardSection from "~/app/_components/UserCardSection";
import UserSearch from "~/app/_components/search/UserSearch";

type urlParams = {
  name?: string;
  order?: "POPULARITY" | "ALPHABETIC";
  pageSize?: string;
  page?: string;
};

type apiParams = {
  take: number;
  skip?: number;
  name?: string;
  orderBy?: "POPULARITY" | "ALPHABETIC";
};

// generate query parameters for api call
const createQueryParams = (params: urlParams) => {
  const { name, order, pageSize, page } = params;
  const numericPageSize = parseInt(pageSize ?? "12");

  const queryParameters: apiParams = {
    take: numericPageSize ?? 12,
    ...(name && { name }),
    ...(order && { orderBy: order }),
    ...(page && { skip: (Number(page) - 1) * (numericPageSize ?? 0) }),
  };

  return queryParameters;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: urlParams;
}) {
  const queryParameters = createQueryParams(searchParams ?? {});
  const displayedUserCards = await api.user.getCards.query(queryParameters);

  // calculate page count for pagination
  const count = await api.user.getCardCount.query(queryParameters);
  const pageCount = Math.ceil(Number(count) / (queryParameters.take ?? 0));

  return (
    <main className="flex flex-col items-center">
      <UserSearch />
      <UserCardSection users={displayedUserCards} />
      {pageCount > 0 ? (
        <QueryPagination pageCount={pageCount} className="mt-2" />
      ) : null}
    </main>
  );
}
