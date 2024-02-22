import { expect, test } from "vitest";
import { calculateAverage } from "~/utils/RatingCalculator";

test("builds the average of an array of reviews", () => {
  const reviews = [{ rating: 3 }, { rating: 4 }, { rating: 5 }];

  const result = calculateAverage(reviews);

  expect(result.averageRating).toBe(4);
  expect(result.totalReviews).toBe(3);
});

test("builds the average of an array of reviews with decimal", () => {
  const reviews = [{ rating: 3 }, { rating: 4 }, { rating: 5 }, { rating: 2 }];

  const result = calculateAverage(reviews);

  expect(result.averageRating).toBe(3.5);
  expect(result.totalReviews).toBe(4);
});

test("builds the average of an array of reviews with mixed positive and negative ratings", () => {
  const reviews = [
    { rating: 3 },
    { rating: -4 },
    { rating: 5 },
    { rating: -2 },
  ];

  const result = calculateAverage(reviews);

  expect(result.averageRating).toBe(0.5);
  expect(result.totalReviews).toBe(4);
});

test("builds the average of an array of reviews with zero ratings", () => {
  const reviews = [{ rating: 0 }, { rating: 0 }, { rating: 0 }];

  const result = calculateAverage(reviews);

  expect(result.averageRating).toBe(0);
  expect(result.totalReviews).toBe(3);
});

test("builds the average of an array of reviews with only one review", () => {
  const reviews = [{ rating: 3 }];

  const result = calculateAverage(reviews);

  expect(result.averageRating).toBe(3);
  expect(result.totalReviews).toBe(1);
});

test("builds the average of an array of reviews with all positive ratings", () => {
  const reviews = [
    { rating: 1 },
    { rating: 2 },
    { rating: 3 },
    { rating: 4 },
    { rating: 5 },
  ];

  const result = calculateAverage(reviews);

  expect(result.averageRating).toBe(3);
  expect(result.totalReviews).toBe(5);
});

test("builds the average of an array of reviews with all negative ratings", () => {
  const reviews = [
    { rating: -1 },
    { rating: -2 },
    { rating: -3 },
    { rating: -4 },
    { rating: -5 },
  ];

  const result = calculateAverage(reviews);

  expect(result.averageRating).toBe(-3);
  expect(result.totalReviews).toBe(5);
});

test("builds the average of an array of reviews with mixed ratings and zero", () => {
  const reviews = [
    { rating: 3 },
    { rating: -4 },
    { rating: 0 },
    { rating: 5 },
    { rating: -2 },
  ];

  const result = calculateAverage(reviews);

  expect(result.averageRating).toBe(0.4);
  expect(result.totalReviews).toBe(5);
});

test("returns 0 for average rating if no reviews", () => {
  const result = calculateAverage([]);

  expect(result.averageRating).toBe(0);
  expect(result.totalReviews).toBe(0);
});

test("returns 0 for average rating if no ratings", () => {
  const result = calculateAverage([{ rating: 0 }]);

  expect(result.averageRating).toBe(0);
  expect(result.totalReviews).toBe(1);
});

test("calculates average rating for reviews with mixed positive, negative and zero ratings", () => {
  const reviews = [
    { rating: 3 },
    { rating: -4 },
    { rating: 0 },
    { rating: 5 },
    { rating: -2 },
    { rating: 0 },
  ];

  const result = calculateAverage(reviews);

  expect(result.averageRating).toBeCloseTo(0.33, 2);
  expect(result.totalReviews).toBe(6);
});

test("calculates average rating for reviews with all zero ratings", () => {
  const reviews = [{ rating: 0 }, { rating: 0 }, { rating: 0 }, { rating: 0 }];

  const result = calculateAverage(reviews);

  expect(result.averageRating).toBe(0);
  expect(result.totalReviews).toBe(4);
});

test("calculates average rating for reviews with all positive ratings", () => {
  const reviews = [
    { rating: 1 },
    { rating: 2 },
    { rating: 3 },
    { rating: 4 },
    { rating: 5 },
    { rating: 5 },
  ];

  const result = calculateAverage(reviews);

  expect(result.averageRating).toBeCloseTo(3.33, 2);
  expect(result.totalReviews).toBe(6);
});

test("calculates average rating for reviews with all negative ratings", () => {
  const reviews = [
    { rating: -1 },
    { rating: -2 },
    { rating: -3 },
    { rating: -4 },
    { rating: -5 },
    { rating: -5 },
  ];

  const result = calculateAverage(reviews);

  expect(result.averageRating).toBeCloseTo(-3.33, 2);
  expect(result.totalReviews).toBe(6);
});

test("returns 0 for average rating if no reviews", () => {
  const result = calculateAverage([]);

  expect(result.averageRating).toBe(0);
  expect(result.totalReviews).toBe(0);
});

test("returns 0 for average rating if only one review with zero rating", () => {
  const result = calculateAverage([{ rating: 0 }]);

  expect(result.averageRating).toBe(0);
  expect(result.totalReviews).toBe(1);
});
