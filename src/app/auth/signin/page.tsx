"use client";
import type { BuiltInProviderType } from "next-auth/providers";
import { Button, CardBody, CardHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { type LiteralUnion, signIn } from "next-auth/react";
import type { ClientSafeProvider } from "next-auth/lib/client";

type ProviderTypes = Record<
  LiteralUnion<BuiltInProviderType>,
  ClientSafeProvider
> | null;

export default function SignIn() {
  const [providers, setProviders] = useState<ProviderTypes>();

  useEffect(() => {
    (async () => {
      setProviders(
        await fetch("/api/auth/providers").then(
          (res) => res.json() as Promise<ProviderTypes>,
        ),
      );
    })().catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <>
      <CardHeader className="flex justify-center">
        <h1 className="text-5xl font-bold">Sign in</h1>
      </CardHeader>
      <CardBody>
        {providers &&
          Object.values(providers).map((provider) => (
            <Button
              key={provider.name}
              variant="solid"
              type="button"
              color="success"
              size="lg"
              className="w-full"
              onPress={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              Sign in with {provider.name}
            </Button>
          ))}
      </CardBody>
    </>
  );
}
