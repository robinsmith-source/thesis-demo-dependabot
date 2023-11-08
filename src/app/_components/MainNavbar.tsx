"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

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
          size="sm"
          src={session.user.image ?? "https://placekitten.com/200/200"}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{session.user.name}</p>
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

export default function MainNavbar({ session }: { session: Session | null }) {
  const pathname = usePathname();

  return (
    <Navbar>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem isActive={pathname === "/"}>
          <Link color="foreground" href={"/"}>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/about"}>
          <Link color="foreground" href={"/about"}>
            About us
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        {session ? (
          <LoginBar session={session} />
        ) : (
          <NavbarItem>
            <Button
              as={Link}
              color="secondary"
              href={"/api/auth/signin"}
              variant="flat"
            >
              Sign in
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem isActive={pathname === "/"}>
          <Link color="foreground" href={"/"}>
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive={pathname === "/about"}>
          <Link color="foreground" href={"/about"}>
            About us
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
