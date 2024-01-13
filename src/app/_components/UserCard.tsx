import { type User as UserType } from "@prisma/client";
import FollowButtonSection from "~/app/_components/FollowButtonSection";
import React from "react";
import { api } from "~/trpc/server";
import { Avatar, Link } from "@nextui-org/react";

export default async function UserCard({
  user,
  highlightLink,
  withFollowButton = true,
}: {
  user: UserType;
  highlightLink?: boolean;
  withFollowButton?: boolean;
}) {
  const userMetadata = await api.user.getMetadata.query({ id: user.id });

  return (
    <div className="grid grid-flow-col grid-cols-[75px,200px,100px] grid-rows-[25px,20px,25px] ">
      <>
        <Link
          className="row-span-3 self-center justify-self-start"
          href={`/user/${user.id}`}
        >
          <Avatar
            size="lg"
            isBordered={highlightLink}
            color="secondary"
            src={user.image ?? undefined}
            name={user.name ?? undefined}
            showFallback
          />
        </Link>

        <Link
          color={highlightLink ? "secondary" : "foreground"}
          showAnchorIcon={highlightLink}
          href={`/user/${user.id}`}
        >
          <h1 className="text-lg font-bold">{user.name}</h1>
        </Link>
      </>

      <p>Created {userMetadata.recipeCount} recipes</p>

      <FollowButtonSection
        userId={user.id}
        followingStatus={userMetadata.following}
        followingCount={userMetadata.followingCount}
        followedByCount={userMetadata.followedByCount}
        withFollowButton={withFollowButton}
      />
    </div>
  );
}
