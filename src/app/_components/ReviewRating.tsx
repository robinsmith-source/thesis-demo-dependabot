import { FaRegStar, FaStar } from "react-icons/fa6";

export default function ReviewRating({ rating }: { rating: number }) {
  return (
    <ul className="flex gap-1 p-2">
      {[1, 2, 3, 4, 5].map((index) => (
        <li key={index}>
          {index <= rating ? (
            <FaStar className="fill-orange-400" size={20} />
          ) : (
            <FaRegStar size={20} />
          )}
        </li>
      ))}
    </ul>
  );
}
