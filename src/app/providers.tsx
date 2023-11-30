"use client";
import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <NextUIProvider navigate={(path) => router.push(path)}>
        {children}
      </NextUIProvider>
    </ThemeProvider>
  );
}
