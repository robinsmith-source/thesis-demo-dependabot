"use client"; // Error components must be Client Components

import { Button } from "@nextui-org/react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Something went wrong!</h1>
        <h2 className="text-xl">{error.message}</h2>
      </div>
      <Button variant="solid" color="warning" onPress={reset}>
        Try Again
      </Button>
    </div>
  );
}
