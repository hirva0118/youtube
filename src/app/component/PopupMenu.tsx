"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const PopupMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = () => {
    setIsOpen(false); // Close the menu
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="bg-slate-600 cursor-pointer py-1 rounded-xl text-white"
      >
        Menu
      </button>

      {isOpen && (
        <div className="absolute top-12 mt-2 right-5 bg-gray-800 text-white shadow-md rounded-sm w-32 p-3">
          <ul className="space-y-2">
            <li className="hover:bg-slate-600">
              <Link
                className=" p-2 cursor-pointer"
                href="/"
                onClick={handleNavigation}
              >
                Home
              </Link>
            </li>
            <li className="hover:bg-slate-600">
              <Link
                className=" p-2 cursor-pointer"
                href="/myProfile"
                onClick={handleNavigation}
              >
                Profile
              </Link>
            </li>
            <li className="hover:bg-slate-600">
              <Link
                className="p-2 cursor-pointer"
                href="/postvideo"
                onClick={handleNavigation}
              >
                Post Video
              </Link>
            </li>

            <li className="hover:bg-slate-600">
              <Link
                className="pl-2 text-sm cursor-pointer"
                href="/watchHistory"
                onClick={handleNavigation}
              >
                Watch History
              </Link>
            </li>

            <li className="hover:bg-slate-600 ">
              <button
                className="cursor-pointer pl-2 hover:bg-slate-600 rounded-lg w-full text-left"
                onClick={() => {
                  <LogoutButton />;
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PopupMenu;
