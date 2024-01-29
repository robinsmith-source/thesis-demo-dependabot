"use client";

import { Pagination } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type QueryPaginationProps = {
  pageCount: number;
  className?: string;
};

export default function QueryPagination({
  pageCount,
  className,
}: QueryPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = searchParams.get("page")
    ? parseInt(searchParams.get("page")?.toString() ?? "")
    : 1;

  const handlePagination = (pageNumber: number) => {
    pageNumber = Math.max(1, pageNumber);
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Pagination
      variant="faded"
      className={className}
      showControls={pageCount > 1}
      siblings={2}
      initialPage={initialPage}
      page={parseInt(searchParams.get("page")?.toString() ?? "1")}
      total={pageCount}
      onChange={handlePagination}
    />
  );
}
