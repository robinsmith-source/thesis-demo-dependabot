"use client";
import { Avatar, Button, Link } from "@nextui-org/react";
import { type User } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

interface UserCardInnerProps {
  user: User;
  userMeta: RouterOutputs["user"]["getMetadata"];
  highlightLink: boolean;
  withFollowButton: boolean;
}

export default function UserCardInner({
  user,
  userMeta,
  highlightLink,
  withFollowButton,
}: UserCardInnerProps) {
  const [updatingFollowStatus, setUpdatingFollowStatus] = useState(
    userMeta.following,
  );

  const [followAdjustment, setFollowAdjustment] = useState(0); // [-1, 0, 1]

  const followMutation = api.user.follow.useMutation({
    onSuccess: () => {
      setUpdatingFollowStatus(true);
      setFollowAdjustment(followAdjustment + 1);
    },
    onError: () => {
      toast.error("Failed to follow user");
    },
  });
  const unfollowMutation = api.user.unfollow.useMutation({
    onSuccess: () => {
      setUpdatingFollowStatus(false);
      setFollowAdjustment(followAdjustment - 1);
    },
    onError: () => {
      toast.error("Failed to unfollow user");
    },
  });

  const onPress = () => {
    if (updatingFollowStatus) {
      unfollowMutation.mutate({
        id: user.id,
      });
    } else {
      followMutation.mutate({
        id: user.id,
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 sm:text-left">
      <Link href={`/user/${user.id}`}>
        <Avatar
          size="lg"
          isBordered={highlightLink}
          color="secondary"
          src={user.image ?? undefined}
          name={user.name ?? undefined}
          showFallback
        />
      </Link>

      <div>
        <Link
          color={highlightLink ? "secondary" : "foreground"}
          showAnchorIcon={highlightLink}
          href={`/user/${user.id}`}
        >
          <h1 className="text-lg font-bold">{user.name}</h1>
        </Link>

        <p>Created {userMeta.recipeCount} recipes</p>

        <div className="flex gap-4 text-foreground-400 dark:text-foreground-600">
          <Link href={`/user/${user.id}/following`} color="foreground">
            <div>
              <strong className="tabular-nums text-foreground">
                {userMeta.followingCount}
              </strong>{" "}
              Following
            </div>
          </Link>
          <Link href={`/user/${user.id}/followers`} color="foreground">
            <div>
              <strong className="tabular-nums text-foreground">
                {userMeta.followedByCount + followAdjustment}
              </strong>{" "}
              {userMeta.followedByCount + followAdjustment === 1
                ? "Follower"
                : "Followers"}
            </div>
          </Link>
        </div>
      </div>

      {userMeta.following !== null && withFollowButton && (
        <Button className="row-span-3 place-self-center" onPress={onPress}>
          {updatingFollowStatus ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  );
}
