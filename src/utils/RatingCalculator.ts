export function calculateAverage(
  reviews: {
    rating: number | null;
  }[],
) {
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
