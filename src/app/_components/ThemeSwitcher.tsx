"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@nextui-org/react";
import { FaMoon, FaSun } from "react-icons/fa6";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <Switch
      isSelected={theme === "dark"}
      onValueChange={(switcherValue: boolean) => {
        setTheme(switcherValue ? "dark" : "light");
      }}
      size="lg"
      color="success"
      startContent={<FaSun />}
      endContent={<FaMoon />}
    />
  );
}
