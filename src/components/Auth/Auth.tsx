"use client";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { setLocalStorage } from "@/src/lib/helpers/localStorage";
import { handleGetUserAuthToken } from "@/src/requests/user.requests";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/src/lib/utils/common-constants";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/redux-store/store";
import { login } from "@/src/redux-store/userSlice";

export default function AuthForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const state = usePathname();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [disable, setDisable] = useState(false);
  const isSignIn = state === CLIENT_ROUTES.SIGNUP_ROUTE ? false : true;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNameValid = /^[A-Za-z\s]{4,}$/.test(name);

  const handleSubmit = async (e: React.FormEvent) => {
    setDisable(true);
    e.preventDefault();
    if (
      !isEmailValid ||
      password === "" ||
      (isSignIn === false && !isNameValid)
    ) {
      setShake(true);
      setDisable(false);
      setTimeout(() => setShake(false), 500);
      return;
    }
    const data = await handleGetUserAuthToken(
      {
        email,
        password,
        name,
      },
      isSignIn
    );
    setDisable(false);
    if (data?.success) {
      setLocalStorage("userInfo", { ...data?.result, email });
      dispatch(
        login({
          name: data?.result?.username,
          email: email,
          isAllowed: data?.result?.isAllowed,
        })
      );
      toast.success(data.message);
      return router.push("/");
    }
    return toast.error(data?.message ? data.message : "Iternal server error");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 dark:from-black dark:to-black px-4 transition-colors duration-500">
      <h1 className="absolute top-4 left-4 cursor-pointer text-2xl font-bold text-purple-600 dark:text-purple-400 transition-transform duration-300 hover:scale-110 hover:text-purple-700 dark:hover:text-purple-300">
        NF-GEN
      </h1>
      <div
        className={clsx(
          "w-full max-w-md px-10 py-8 rounded-xl shadow-2xl bg-white transition-all duration-500",
          "dark:bg-[#1a1a1a]", // Lighter black for dark mode
          { "animate-shake": shake }
        )}
      >
        <h1 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-5">
          {isSignIn === true ? "Sign In" : "Sign Up"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <>
            {isSignIn === false ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={clsx(
                    "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 transition",
                    isNameValid
                      ? "border-green-500 focus:ring-green-500"
                      : "border-red-500 focus:ring-red-500",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  )}
                  required
                />
              </div>
            ) : null}
          </>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={clsx(
                "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 transition",
                isEmailValid
                  ? "border-green-500 focus:ring-green-500"
                  : "border-red-500 focus:ring-red-500",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              )}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-sm text-gray-500 dark:text-gray-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {/* Sign up or sign in */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => {
                if (isSignIn) return router.push(CLIENT_ROUTES.SIGNUP_ROUTE);
                return router.push(CLIENT_ROUTES.LOGIN_ROUTE);
              }}
              className="text-purple-600 dark:text-purple-400 cursor-pointer hover:underline font-semibold"
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </span>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className={`mt-1 w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-md font-semibold shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer
    ${
      disable
        ? "opacity-50 cursor-not-allowed hover:shadow-md active:scale-100"
        : ""
    }
  `}
            disabled={disable}
          >
            {disable ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : isSignIn === true ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
