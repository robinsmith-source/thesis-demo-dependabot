import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
  User,
} from "@nextui-org/react";
import ReviewRating from "~/app/_components/ReviewRating";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";

type ReviewCardProps = {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    author?: {
      id: string;
      name: string | null;
      image: string | null;
    };
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
    <Card className="w-[36rem]">
      <CardHeader className="flex items-center justify-between">
        <ReviewRating rating={rating} />
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
