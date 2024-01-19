import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function RatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (newValue: number) => void;
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleMouseEnter = (index: number) => {
    setHoverValue(index);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const handleClick = (index: number) => {
    onChange(index);
  };

  return (
    <>
      <ul className="flex gap-1 p-2" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((index) => (
          <motion.li
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleClick(index)}
            whileHover={{
              scale: 1.2,
              rotate: 30,
              transition: { duration: 0.5 },
            }}
            exit={{ scale: 1, rotate: 0, transition: { duration: 0.5 } }}
          >
            {index <= (hoverValue || value) ? (
              <FaStar className="fill-orange-400" size={20} />
            ) : (
              <FaRegStar className="fill-gray-400" size={20} />
            )}
          </motion.li>
        ))}
      </ul>
    </>
  );
}
