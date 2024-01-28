import { api } from "~/trpc/server";
import UserCardSection from "~/app/_components/UserCardSection";

export default async function Following({
  params,
}: {
  params: { id: string };
}) {
  const following = await api.user.getFollowing.query({ id: params.id });

  return (
    <main className="flex flex-wrap">
      <UserCardSection users={following} />
    </main>
  );
}
