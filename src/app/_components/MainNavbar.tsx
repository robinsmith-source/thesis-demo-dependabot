"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import type { Session } from "next-auth";
import ThemeSwitcher from "~/app/_components/ThemeSwitcher";
import NextImage from "next/image";
import NextLink from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

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

export default function MainNavbar({ session }: { session: Session | null }) {
  
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarLinks = [
    { name: "Home", href: "/" },
    { name: "Recipes", href: "/recipe/search" },
    { name: "Users", href: "/user/search" },
  ];

  return (
    <Navbar
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent justify="center">
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
      </NavbarContent>

      <NavbarContent justify="center" className="hidden space-x-4 pl-2 sm:flex">
        {navbarLinks.map((item, index) => (
          <NavbarItem key={`${index}`}>
            <Link
              as={NextLink}
              href={item.href}
              className={
                pathname === item.href ? "text-primary-600" : "text-default-600"
              }
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
          {session?.user ? (
            <LoginBar session={session} />
          ) : (
            <Button
              as={NextLink}
              color="secondary"
              href={"/api/auth/signin"}
              variant="flat"
            >
              Sign in
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {navbarLinks.map((item) => (
          <NavbarMenuItem key={`${item.name}`}>
            <Link
              as={NextLink}
              href={item.href}
              size="lg"
              className={
                pathname === item.href ? "w-full text-primary-600" : "w-full text-default-600"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
