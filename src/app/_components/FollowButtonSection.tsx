"use client";
import { Button, Link } from "@nextui-org/react";
import { api } from "~/trpc/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function FollowButtonSection({
  userId,
  followingStatus,
  followingCount,
  followedByCount,
  withFollowButton = true,
}: {
  userId: string;
  followingStatus: boolean | null;
  followingCount: number;
  followedByCount: number;
  withFollowButton?: boolean;
}) {
  const [updatingFollowStatus, setUpdatingFollowStatus] =
    useState(followingStatus);

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
        id: userId,
      });
    } else {
      followMutation.mutate({
        id: userId,
      });
    }
  };

  return (
    <>
      <div className="flex gap-4 text-foreground-400 dark:text-foreground-600">
        <Link href={`/user/${userId}/following`} color="foreground">
          <div>
            <strong className="tabular-nums text-foreground">
              {followingCount}
            </strong>{" "}
            Following
          </div>
        </Link>
        <Link href={`/user/${userId}/followers`} color="foreground">
          <div>
            <strong className="tabular-nums text-foreground">
              {followedByCount + followAdjustment}
            </strong>{" "}
            {followedByCount + followAdjustment === 1
              ? "Follower"
              : "Followers"}
          </div>
        </Link>
      </div>
      {followingStatus !== null && withFollowButton && (
        <Button className="row-span-3 place-self-center" onPress={onPress}>
          {updatingFollowStatus ? "Unfollow" : "Follow"}
        </Button>
      )}
    </>
  );
}
