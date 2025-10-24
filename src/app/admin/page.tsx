"use client";

import { getLocalStorage } from "@/src/lib/helpers/localStorage";
import { handleVerifyAdmin } from "@/src/requests/admin.requests";
import {
  handleDeleteUserfromDB,
  handleGetUsers,
  handleUpdateUserAllowance,
} from "@/src/requests/user.requests";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { BsTrash } from "react-icons/bs";

interface User {
  name: string;
  username: string;
  email: string;
  isAllowed: boolean;
}

const UserCard = ({
  auth_email,
  user,
  index,
  setUsers,
}: {
  auth_email: string;
  user: User;
  index: number;
  setUsers: Dispatch<SetStateAction<User[]>>;
}) => {
  const handleAllowance = async () => {
    const { success } = await handleUpdateUserAllowance(
      auth_email,
      user.email,
      !user.isAllowed
    );
    if (success) {
      setUsers((prev: User[]) =>
        prev.map((U, i) =>
          i === index ? { ...U, isAllowed: !U.isAllowed } : U
        )
      );
    }
  };

  const handleDeleteUser = async () => {
    const { success } = await handleDeleteUserfromDB(
      auth_email,
      user.email,
      !user.isAllowed
    );
    if (success) {
      setUsers((prev: User[]) => prev.filter((U, i) => i != index));
    }
  };

  return (
    <div className="relative p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-900 mb-4">
      {/* Delete button at top-right */}
      <>
        {user.isAllowed ? null : (
          <button
            onClick={() => handleDeleteUser()}
            className="absolute top-2 right-2 flex items-center justify-center p-2 text-red-600 rounded-full transition-colors duration-200"
          >
            <BsTrash className="w-5 h-5" />
          </button>
        )}
      </>

      {/* User details */}
      <p className="text-gray-700 dark:text-gray-300">
        <strong>Name:</strong> {user.name}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>Username:</strong> {user.username}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>Email:</strong> {user.email}
      </p>

      {/* Toggle */}
      <div className="flex items-center mt-3">
        <span className="mr-3 text-gray-700 dark:text-gray-300 font-medium">
          Is Allowed:
        </span>
        <button
          onClick={() => handleAllowance()}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            user.isAllowed ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              user.isAllowed ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const router = useRouter();
  const user = getLocalStorage("userInfo");
  const username = user?.username;
  const email = user?.email;
  const [users, setUsers] = useState<User[]>([]);
  const handleAdmin = useCallback(async () => {
    const { result } = await handleVerifyAdmin(email);
    if (result?.isAdmin != true) return router.push("/");
    const { result: res } = await handleGetUsers({ email }, 1, 10, "");
    setUsers(res?.users);
  }, [router, email]);

  useEffect(() => {
    handleAdmin();
  }, [handleAdmin]);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white dark:bg-black/10 shadow-xl rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Admin Panel
      </h1>
      <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
        Users
      </h3>
      <div>
        {users.map((user, index) => {
          if (username != user.username)
            return (
              <UserCard
                key={index}
                user={user}
                index={index}
                setUsers={setUsers}
                auth_email={email}
              />
            );
        })}
      </div>
    </div>
  );
};

export default AdminPage;
