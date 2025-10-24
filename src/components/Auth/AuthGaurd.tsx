"use client";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/src/lib/utils/common-constants";
import {
  getLocalStorage,
  removeLocalStorage,
} from "@/src/lib/helpers/localStorage";
import { handleGetUserAllowance } from "@/src/requests/user.requests";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux-store/store";
import { login, logout, setAllowance } from "@/src/redux-store/userSlice";

export const SplashScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1.2, opacity: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
      className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 blur-3xl opacity-40"
    />
    <motion.h1
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative text-6xl md:text-7xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 drop-shadow-lg"
    >
      NF-GEN
    </motion.h1>
    <div className="flex space-x-2 mt-6">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-3 h-3 rounded-full bg-cyan-400"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "loop",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  </div>
);

const AccessDenied = ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const handleSignOut = () => {
    removeLocalStorage("userInfo");
    dispatch(logout());
    router.push("/login");
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.4 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-red-500 to-purple-700 blur-3xl"
      />
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-500 drop-shadow-lg"
      >
        NF-GEN
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-6 p-4 bg-white/10 dark:bg-black/30 backdrop-blur-lg rounded-xl border border-red-500/50 shadow-lg text-center"
      >
        <p className="text-lg font-semibold text-white">{username}</p>
        <p className="text-sm text-gray-300">{email}</p>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-6 text-lg md:text-xl text-gray-300 font-medium text-center px-6"
      >
        Access not granted <br />
        Please contact your administrator for required permissions.
      </motion.p>
      <div className="flex space-x-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-3 h-3 rounded-full bg-red-400"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSignOut}
        className="mt-8 px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg transition"
      >
        Sign Out
      </motion.button>
    </div>
  );
};

export default function ClientAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = getLocalStorage("userInfo");

  const token = user?.access_token;
  const username = user?.username;
  const email = user?.email;

  const dispatch = useDispatch<AppDispatch>();

  const [state, setState] = useState<
    "initial" | "not-access" | "access" | "auth"
  >("initial");

  useEffect(() => {
    if (username && email) {
      dispatch(login({ name: username, email, isAllowed: false }));
    }
  }, [dispatch, username, email]);

  const handleIsAllowed = useCallback(async () => {
    if (!email) return false;
    const { result } = await handleGetUserAllowance(email);
    const allowed = result?.isAllowed || false;
    dispatch(setAllowance({ isAllowed: allowed }));
    return allowed;
  }, [email, dispatch]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setState("auth");
        router.push(
          pathname === CLIENT_ROUTES.LOGIN_ROUTE
            ? CLIENT_ROUTES.LOGIN_ROUTE
            : CLIENT_ROUTES.SIGNUP_ROUTE
        );
        return;
      }

      const allowed = await handleIsAllowed();
      setState(allowed ? "access" : "not-access");
    };

    checkAuth();
  }, [token, pathname, router, handleIsAllowed]);

  if (state === "initial") return <SplashScreen />;
  if (state === "not-access")
    return <AccessDenied username={username} email={email} />;
  if (state === "access" || state === "auth") return <>{children}</>;

  return null;
}
