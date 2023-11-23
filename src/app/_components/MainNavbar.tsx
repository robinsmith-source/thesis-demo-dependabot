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
import NextLink from "next/link";
import NextImage from "next/image";

import type {Session} from "next-auth";
import {useSession} from "next-auth/react";

function LoginBar({ session }: { session: Session }) {
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
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">
            Signed in as <br />
            {session.user.name}
          </p>
        </DropdownItem>
        <DropdownItem key="settings" href={`/user/${session.user.id}`}>
          My Profile
        </DropdownItem>
        <DropdownItem key="logout" color="danger" href={"/api/auth/signout"}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}



export default function MainNavbar() {
  const { data: session } = useSession();

  return (
    <Navbar maxWidth="xl" className="bg-white">
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
        <Button href="/" as={NextLink} size="lg" variant="light">
          Home
        </Button>
        <Dropdown>
          <DropdownTrigger>
            <Button size="lg" variant="light">
              Explore
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="Recipes" href="/recipes/public" as={NextLink}>Recipes</DropdownItem>
          <DropdownItem key="Users" href="/users" as={NextLink}>Users</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        {session ? (
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
