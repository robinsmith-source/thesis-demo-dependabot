"use client";
import { Button, CardBody, CardHeader } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";

export default function Page() {
  const { status } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <CardHeader className="flex flex-col content-center items-center justify-center gap-3">
        <h1 className="text-5xl font-bold">Signout</h1>
        <h2 className="text-center text-xl">
          Are you sure you want to sign out?
        </h2>
      </CardHeader>
      <CardBody>
        <Button
          variant="solid"
          type="button"
          color="danger"
          size="lg"
          className="w-full"
          isLoading={status === "loading"}
          onPress={() => handleSignOut()}
        >
          Sign out
        </Button>
      </CardBody>
    </>
  );
}
