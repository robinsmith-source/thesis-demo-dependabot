"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import NextLink from "next/link";
import ThemeSwitcher from "~/app/_components/ThemeSwitcher";

function LoginBar({ session }: { session: Session }) {
  if (!session?.user) return null;
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={session.user.name ?? undefined}
          size="md"
          src={session.user.image ?? "https://placekitten.com/200/200"}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem
          textValue={`Signed in as ${session.user.name}`}
          key="profile"
          className="h-14 gap-2"
        >
          <p className="font-semibold">
            Signed in as <br />
            {session.user.name}
          </p>
        </DropdownItem>
        <DropdownItem
          as={NextLink}
          key="settings"
          href={`/user/${session.user.id}`}
        >
          My Profile
        </DropdownItem>
        <DropdownItem
          as={NextLink}
          key="saved"
          href={`/user/${session.user.id}/saved`}
        >
          Saved Recipes
        </DropdownItem>
        <DropdownItem as={NextLink} key="create-recipe" href={`/recipe/create`}>
          Create Recipe
        </DropdownItem>
        <DropdownItem as={NextLink} key="shopping-list" href={`/shopping-list`}>
          Shopping List
        </DropdownItem>
        <DropdownItem
          as={NextLink}
          key="logout"
          color="danger"
          href={"/api/auth/signout"}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default function MainNavbar() {
  const { data: session } = useSession();

  return (
    <Navbar maxWidth="xl" className="bg">
      <NavbarBrand>
        <NextLink href="/">
          <Image
            as={NextImage}
            width={50}
            height={50}
            src="/images/Logo_round_V2.png"
            alt="Logo"
          />
        </NextLink>
      </NavbarBrand>
      <NavbarContent as="div" justify="end">
        <ThemeSwitcher />
        {session?.user ? (
          <LoginBar session={session} />
        ) : (
          <NavbarItem>
            <Button
              as={NextLink}
              color="secondary"
              href={"/api/auth/signin"}
              variant="flat"
            >
              Sign in
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
