"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
  User,
} from "@nextui-org/react";
import type { RecipeReview } from "@prisma/client";
import { useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import ReviewRating from "~/app/_components/ReviewRating";

type RecipeCardProps = RecipeReview & {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export default function ReviewCard({
  review,
  onEdit,
}: {
  review: RecipeCardProps;
  onEdit: (review: RecipeCardProps) => void;
}) {
  const { rating, comment, author } = review;

  const handleEdit = () => {
    onEdit(review);
  };

  return (
    <Card className="w-[36rem]">
      <CardHeader className="-mb-4 flex justify-between">
        <ReviewRating rating={rating} />
        <Button
          isIconOnly
          size="sm"
          color="secondary"
          variant="flat"
          onClick={handleEdit}
        >
          <FaPenToSquare />
        </Button>
      </CardHeader>
      {comment && <CardBody>{comment}</CardBody>}
      <CardFooter className="-mt-4 flex justify-end">
        <User
          name={
            <Link
              color="secondary"
              href={`/user/${author.id}`}
              showAnchorIcon
              size="sm"
            >
              {author.name}
            </Link>
          }
          avatarProps={{
            src: author.image ?? undefined,
            showFallback: true,
            size: "sm",
          }}
        />
      </CardFooter>
    </Card>
  );
}
