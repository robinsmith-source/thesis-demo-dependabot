export type Review = {
  rating: number;
};

export function calculateAverage(reviews: Review[]) {
  const totalRatings = reviews.reduce(
    (sum, review) => sum + (review.rating ?? 0),
    0,
  );
  const averageRating = reviews.length > 0 ? totalRatings / reviews.length : 0;

  return {
    averageRating,
    totalReviews: reviews.length,
  };
}
