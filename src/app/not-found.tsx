import { Card, CardHeader, Image } from "@nextui-org/react";

export default function NotFound() {
  return (
    <div>
      <Card className="h-96">
        <CardHeader className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform flex-col !items-center">
          <h2 className="justify-center text-center text-5xl font-semibold text-white">
            Meow-ops! You&apos;ve stumbled upon our kitchen chaos, where cat
            recipes and culinary capers collide! 🐱🍳
          </h2>
        </CardHeader>
        <Image
          removeWrapper
          alt="404 background"
          className="z-0 h-full w-full object-cover brightness-75"
          src="https://placekitten.com/800/500"
        />
      </Card>
    </div>
  );
}
