"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="px-4 py-2 text-xs font-bold rounded-full 
      bg-orange-600 dark:bg-white 
      text-white dark:text-black
      transition-all duration-300"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
