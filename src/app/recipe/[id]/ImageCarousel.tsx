"use client";

import { useState } from "react";
import { Button, Card, Chip, Image } from "@nextui-org/react";
import NextImage from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

export default function ImageCarousel({ images }: { images: string[] }) {
  const [imageIndex, setImageIndex] = useState(0);

  if (images.length === 0) {
    return <div></div>;
  }

  return (
    <Card className="group relative row-span-2 h-96 w-96 place-self-center">
      <AnimatePresence initial={false}>
        <motion.div className="h-full w-full" key={images[imageIndex]}>
          <Image
            as={NextImage}
            priority
            width={500}
            height={500}
            removeWrapper
            alt="recipe header"
            className="z-0 h-full w-full object-cover"
            src={`https://utfs.io/f/${images[imageIndex]}`}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 right-10 z-10 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Chip size="md" radius="sm" variant="flat" className="tracking-wider">
          {imageIndex + 1}/{images.length}
        </Chip>

        <Button
          isDisabled={images.length < 2}
          isIconOnly
          startContent={<FaChevronLeft />}
          size="sm"
          onPress={() => {
            setImageIndex((i) => (i - 1 < 0 ? images.length - 1 : i - 1));
          }}
        />
        <Button
          isDisabled={images.length < 2}
          isIconOnly
          startContent={<FaChevronRight />}
          size="sm"
          onPress={() => {
            setImageIndex((i) => (i + 1 >= images.length ? 0 : i + 1));
          }}
        />
      </div>
    </Card>
  );
}
