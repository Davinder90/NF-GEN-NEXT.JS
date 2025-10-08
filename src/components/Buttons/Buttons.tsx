"use client";
import { removeLocalStorage } from "@/src/lib/helpers/localStorage";
import { CLIENT_ROUTES } from "@/src/lib/utils/common-constants";
import { AppDispatch } from "@/src/redux-store/store";
import { logout } from "@/src/redux-store/userSlice";
import { useRouter } from "next/navigation";
import { GoSignOut } from "react-icons/go";
import { MdAdminPanelSettings } from "react-icons/md";
import { useDispatch } from "react-redux";

export const SignOutButton = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const handleSignOut = () => {
    removeLocalStorage("userInfo");
    dispatch(logout());
    router.push(CLIENT_ROUTES.LOGIN_ROUTE);
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

export const AdminButton = () => {
  const router = useRouter();
  const handleAdminCheck = () => {
    router.push(CLIENT_ROUTES.ADMIN_ROUTE);
  };
  return (
    <button
      onClick={handleAdminCheck}
      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
        text-black bg-gray-100 hover:bg-green-100 hover:text-green-600
        dark:text-white dark:bg-[#1f1f1f] dark:hover:bg-[#2a2a2a] dark:hover:text-green-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:scale-95"
    >
      <MdAdminPanelSettings className="text-lg transition-transform duration-200 group-hover:rotate-[-10deg]" />
      <span className="group-hover:underline">Admin</span>
    </button>
  );
};
