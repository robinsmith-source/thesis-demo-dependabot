import { api } from "~/trpc/server";
import ReviewFormHandler from "./ReviewFormHandler";
import ReviewCard from "./ReviewCard";

export default async function ReviewSection({
  recipeId,
  hideReviewForm = false,
}: {
  recipeId: string;
  hideReviewForm?: boolean;
}) {
  const otherReviews = await api.review.getOthers.query({ recipeId });

  let myReview = null;
  if (!hideReviewForm) {
    myReview = await api.review.getMyReview.query({
      recipeId,
    });
  }

  return (
    <section className="flex flex-col items-center">
      {!hideReviewForm && (
        <ReviewFormHandler recipeId={recipeId} myReviewQuery={myReview} />
      )}
      {otherReviews && otherReviews.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-center gap-3">
          {otherReviews.map((review) => (
            <ReviewCard review={review} key={review.id} />
          ))}
        </div>
      )}
    </section>
  );
}
