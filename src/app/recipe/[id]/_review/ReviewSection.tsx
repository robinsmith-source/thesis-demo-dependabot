import { api } from "~/trpc/server";
import ReviewForm from "./ReviewForm";

export default function ReviewSection({ recipeId }: { recipeId: string }) {
  const reviewByUser = api.review.getFirstReview.query({ recipeId });
  const otherReviews = api.review.getOtherReviews.query({ recipeId });

  return (
    <>
      <ReviewForm recipeId={recipeId} formValue={{ reviewByUser }} />;
      {otherReviews.map((review) => (
        <ReviewCard review={review} key={review.id} />
      ))}
    </>
  );
}
