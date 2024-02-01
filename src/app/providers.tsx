"use client";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { NextUIProvider } from "@nextui-org/react";
import { type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <NextUIProvider navigate={(path) => router.push(path)}>
        {children}
      </NextUIProvider>
    </ThemeProvider>
  );
}
