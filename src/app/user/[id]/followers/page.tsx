import { api } from "~/trpc/server";
import UserCard from "~/app/_components/UserCard";
import { Card } from "@nextui-org/card";
import { CardBody } from "@nextui-org/react";

export default async function Followers({
  params,
}: {
  params: { id: string };
}) {
  const followers = await api.user.getFollowers.query({ id: params.id });

  return (
    <main className="flex flex-wrap">
      {followers.map((follower) => (
        <Card key={follower.id}>
          <CardBody>
            <UserCard user={follower} />
          </CardBody>
        </Card>
      ))}
    </main>
  );
}
