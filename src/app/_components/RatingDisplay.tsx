import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export default function RatingDisplay({
  size = 20,
  rating,
  total,
  isMinimalistic = false,
}: {
  size?: number;
  rating: number;
  total?: number;
  isMinimalistic?: boolean;
}) {
  const intRating = Math.floor(rating);
  const fracRating = rating - intRating;

  return (
    <div className="flex justify-center gap-x-2">
      {isMinimalistic ? (
        <div className="flex items-center gap-x-2">
          <FaStar
            className={rating ? "fill-orange-400" : "fill-gray-400"}
            size={size}
          />
          {rating > 0 && (
            <strong className="font-semibold text-white">
              {rating > 0 ? rating.toFixed(1) : rating}
            </strong>
          )}
        </div>
      ) : (
        <>
          <ul className="flex gap-1">
            {[1, 2, 3, 4, 5].map((index) => (
              <li key={index}>
                {index <= intRating ? (
                  <FaStar className="fill-orange-400" size={size} />
                ) : index - 1 === intRating && fracRating >= 0.5 ? (
                  <FaStarHalfAlt className="fill-orange-400" size={size} />
                ) : (
                  <FaRegStar size={size} className="fill-gray-400" />
                )}
              </li>
            ))}
          </ul>
          {!!total && (
            <>
              <strong className="font-semibold">{rating.toFixed(1)}</strong>
              <span className="font-light">
                ({total} {total === 1 ? "Review" : "Reviews"})
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
}
