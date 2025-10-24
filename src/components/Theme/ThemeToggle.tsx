"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until the component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent SSR mismatch

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        px-4 py-2 rounded-md border 
        border-gray-300 dark:border-gray-600 
        bg-white dark:bg-gray-800 
        text-gray-800 dark:text-gray-100 
        hover:bg-gray-100 dark:hover:bg-gray-700 
        transition duration-300 
        flex items-center justify-center 
        gap-2
        cursor-pointer
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400
      "
      aria-label="Toggle Theme"
      title="Toggle light/dark theme"
    >
      {theme === "light" ? (
        <span className="flex items-center gap-1">
          <FaMoon className="text-yellow-400" /> Dark
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <FaSun className="text-yellow-300" /> Light
        </span>
      )}
    </button>
  );
}
