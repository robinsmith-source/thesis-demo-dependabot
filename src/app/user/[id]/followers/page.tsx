import { api } from "~/trpc/server";
import UserCardSection from "~/app/_components/UserCardSection";

export default async function Followers({
  params,
}: {
  params: { id: string };
}) {
  const followers = await api.user.getFollowers.query({ id: params.id });

  return (
    <main className="flex flex-wrap">
      <UserCardSection users={followers} />
    </main>
  );
}
