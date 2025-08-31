"use client";
import { removeLocalStorage } from "@/src/lib/helpers/localStorage";
import { useRouter } from "next/navigation";
import { GoSignOut } from "react-icons/go";

export const SignOutButton = () => {
  const router = useRouter();
  const handleSignOut = () => {
    removeLocalStorage("userInfo");
    router.push("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
        text-black bg-gray-100 hover:bg-orange-100 hover:text-orange-600
        dark:text-white dark:bg-[#1f1f1f] dark:hover:bg-[#2a2a2a] dark:hover:text-orange-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 active:scale-95"
    >
      <GoSignOut className="text-lg transition-transform duration-200 group-hover:rotate-[-10deg]" />
      <span className="group-hover:underline">Sign Out</span>
    </button>
  );
};
