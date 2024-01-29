"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { NextUIProvider } from "@nextui-org/react";
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
