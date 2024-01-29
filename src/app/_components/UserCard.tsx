import { type User as UserType } from "@prisma/client";
import UserCardInner from "~/app/_components/UserCardInner";
import { api } from "~/trpc/server";

export default async function UserCard({
  user,
  highlightLink = false,
  withFollowButton = true,
}: {
  user: UserType;
  highlightLink?: boolean;
  withFollowButton?: boolean;
}) {
  const userMetadata = await api.user.getMetadata.query({ id: user.id });

  return (
    <UserCardInner
      user={user}
      userMeta={userMetadata}
      highlightLink={highlightLink}
      withFollowButton={withFollowButton}
    />
  );
}
