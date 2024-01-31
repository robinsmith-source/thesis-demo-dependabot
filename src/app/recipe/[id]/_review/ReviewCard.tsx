import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
  User,
} from "@nextui-org/react";
import RatingDisplay from "~/app/_components/RatingDisplay";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { type RecipeReview } from "@prisma/client";
import { type User as UserType } from "@prisma/client";

type ReviewCardProps = {
  review: Pick<RecipeReview, "id" | "rating" | "comment"> & {
    author?: Pick<UserType, "id" | "name" | "image">;
  };
  handleEditClick?: () => void;
  handleDeleteClick?: () => void;
};

export default function ReviewCard({
  review,
  handleEditClick,
  handleDeleteClick,
}: ReviewCardProps) {
  const { rating, comment, author } = review;

  return (
    <Card className="w-full sm:w-[36rem]">
      <CardHeader className="flex items-center justify-between">
        <RatingDisplay rating={rating} />
        <div className="flex gap-2">
          {handleEditClick && (
            <Button
              isIconOnly
              size="sm"
              onPress={handleEditClick}
              color="default"
            >
              <FaPenToSquare />
            </Button>
          )}
          {handleDeleteClick && (
            <Button
              isIconOnly
              size="sm"
              onPress={() => handleDeleteClick()}
              color="danger"
            >
              <FaTrash />
            </Button>
          )}
        </div>
      </CardHeader>
      {comment && <CardBody className="px-6">{comment}</CardBody>}
      <CardFooter className="flex justify-end">
        {author && (
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
        )}
      </CardFooter>
    </Card>
  );
}
