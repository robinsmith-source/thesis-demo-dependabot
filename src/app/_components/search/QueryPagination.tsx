"use client";

import { Pagination } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type QueryPaginationProps = {
    pageCount: number;
    className?: string;
  };

export default function QueryPagination({ pageCount, className = "w-1/3" }: QueryPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  if (!className) className = "w-1/3";

  const initialPage = searchParams.get("page")
    ? parseInt(searchParams.get("page")?.toString() ?? "")
    : 1;


  const handlePagination = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Pagination
      variant="bordered"
      className={className}
      showControls
      siblings={2}
      initialPage={initialPage}
      total={pageCount}
      onChange={(page) => {
        handlePagination(page);
      }}
    />
  );
}
