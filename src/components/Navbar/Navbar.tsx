"use client";
import { useState } from "react";
import ThemeToggle from "@components/Theme/ThemeToggle";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import { AdminButton, SignOutButton } from "@components/Buttons/Buttons";
import Image from "next/image";
import { Images } from "@/src/config/Images";
import { CLIENT_ROUTES } from "@/src/lib/utils/common-constants";

const NavLinks = ({ type }: { type: "small" | "big" }) => {
  const nav_links = [
    {
      name: "Sites",
      link: CLIENT_ROUTES.SITES_ROUTE + `?network=4G&page=1&limit=10`,
    },
    { name: "Tasks", link: CLIENT_ROUTES.TASKS_ROUTE },
    { name: "Files", link: CLIENT_ROUTES.FILES_ROUTE },
  ];

  const baseClasses =
    "text-sm font-semibold px-3 py-2 rounded-md transition duration-200";
  const classMap: Record<"small" | "big", string> = {
    small:
      baseClasses +
      " w-full text-black dark:text-white hover:bg-orange-100 dark:hover:bg-[#1f1f1f] hover:text-orange-600 dark:hover:text-orange-400",
    big:
      baseClasses +
      " text-black dark:text-white hover:text-orange-600 hover:bg-orange-100 dark:hover:text-orange-300 dark:hover:bg-[#1f1f1f]",
  };

  return (
    <>
      {nav_links.map((nav_link, index) => (
        <Link
          key={index}
          href={nav_link.link}
          className={classMap[type] + (type === "small" ? " block" : "")}
        >
          {nav_link.name}
        </Link>
      ))}
    </>
  );
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-[#121212] border-b border-white shadow-md px-4 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href={CLIENT_ROUTES.HOME_ROUTE}>
            <Image
              src={Images.LOGO1}
              alt="NF-GEN"
              width={50}
              height={50}
              className="transition-transform duration-300 hover:rotate-6 dark:invert"
            />
          </Link>
          <span className="text-xl font-bold tracking-wide text-black dark:text-white">
            NF-GEN
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks type="big" />
          <SignOutButton />
          <AdminButton />
          <ThemeToggle />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-black dark:text-white text-2xl p-2 rounded-md hover:bg-orange-100 dark:hover:bg-[#1f1f1f] transition"
          >
            <IoMenu />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-white dark:bg-[#121212] shadow-lg border border-white rounded-lg px-4 py-4 space-y-4 flex flex-col">
          <NavLinks type="small" />
          <SignOutButton />
          <AdminButton />
          <ThemeToggle />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
