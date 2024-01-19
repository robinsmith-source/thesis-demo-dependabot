import { api } from "~/trpc/server";
import UserCard from "~/app/_components/UserCard";
import { Card } from "@nextui-org/card";
import { CardBody } from "@nextui-org/react";

export default async function Following({
  params,
}: {
  params: { id: string };
}) {
  const following = await api.user.getFollowing.query({ id: params.id });

  return (
    <main className="flex flex-wrap">
      {following.map((follower) => (
        <Card key={follower.id}>
          <CardBody>
            <UserCard user={follower} />
          </CardBody>
        </Card>
      ))}
    </main>
  );
}
