"use client";
import { motion, useInView, useAnimation } from "framer-motion";
import { Children, type ReactNode, useEffect, useRef } from "react";

interface FadeInProps {
  className?: string;
  children: ReactNode | ReactNode[];
  direction?: "top" | "bottom" | "left" | "right";
  offset?: number;
}

export const FadeIn = ({
  className,
  children,
  direction = "bottom",
  offset = 0,
}: FadeInProps) => {
  const childrenArray = Children.toArray(children);

  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: { opacity: 0, y: 0, x: 0 },
    visible: { opacity: 1, y: 0, x: 0 },
  };

  switch (direction) {
    case "top":
      variants.hidden.y = -40;
      break;
    case "bottom":
      variants.hidden.y = 40;
      break;
    case "left":
      variants.hidden.x = -40;
      break;
    case "right":
      variants.hidden.x = 40;
      break;
  }

  useEffect(() => {
    if (isInView) {
      void controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <div>
      {Array.isArray(childrenArray) &&
        childrenArray.map((child, index) => {
          return (
            <motion.div
              ref={ref}
              key={index}
              variants={variants}
              initial="hidden"
              animate={controls}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100,
                ease: "easeInOut",
                delay: 0.3 * index + offset,
                bounce: 0.4,
              }}
              whileInView="animate"
              className={className}
            >
              {child}
            </motion.div>
          );
        })}
    </div>
  );
};
