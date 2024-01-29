"use client";

import { useState } from "react";
import { RiKnifeFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function DifficultyInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [hoverValue, setHoverValue] = useState(0);
  const [clickedValue, setClickedValue] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setHoverValue(index);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const updateURLParams = (difficulty: number | null) => {
    const params = new URLSearchParams(searchParams);
    // reset page
    if (params.get("page") !== "1") {
      params.set("page", "1");
    }
    
    if (difficulty !== null) {
      params.set("difficulty", difficulty.toString());
    } else {
      params.delete("difficulty");
    }
    void router.replace(`${pathname}?${params.toString()}`);
  };

  const handleClick = useDebouncedCallback((index: number) => {
    if (clickedValue === index) {
      setClickedValue(null);
      setHoverValue(0);
      updateURLParams(null);
    } else {
      setClickedValue(index);
      updateURLParams(index);
    }
  }, 333);
  

  return (
    <>
      <ul className="flex gap-1 p-2" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4].map((index) => (
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
            <RiKnifeFill
              className={
                index <= (clickedValue ?? hoverValue)
                  ? (clickedValue ?? hoverValue) <= 2
                    ? "text-green-500"
                    : (clickedValue ?? hoverValue) <= 3
                      ? "text-yellow-500"
                      : "text-red-500"
                  : ""
              }
              size={20}
            />
          </motion.li>
        ))}
      </ul>
    </>
  );
}
