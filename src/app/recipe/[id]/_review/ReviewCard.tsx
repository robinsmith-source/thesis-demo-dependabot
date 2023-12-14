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
import { FaPenToSquare } from "react-icons/fa6";
import ReviewRating from "~/app/_components/ReviewRating";

type RecipeCardProps = RecipeReview & {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export default function ReviewCard({ review }: { review: RecipeCardProps }) {
  const { rating, comment, author } = review;

  return (
    <Card className="w-96">
      <CardHeader className="-mb-4 flex justify-between">
        <ReviewRating rating={rating} />
        <Button isIconOnly size="sm" color="secondary" variant="flat">
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
