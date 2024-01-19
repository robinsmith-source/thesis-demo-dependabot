import { api } from "~/trpc/server";
import UserCard from "~/app/_components/UserCard";
import { Divider } from "@nextui-org/react";
import { notFound } from "next/navigation";

export default async function UserLayout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const user = await api.user.get.query({ id: params.id });
  if (!user) {
    notFound();
  }

  return (
    <div>
      <UserCard user={user} />
      <Divider className="my-4" />
      {children}
    </div>
  );
}
