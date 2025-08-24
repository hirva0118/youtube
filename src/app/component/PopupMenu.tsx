"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const PopupMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
   const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // 1. Create ref

    useEffect(() => {
    setMounted(true); // ✅ Only true after hydration
  }, []);

  // 2. Toggle the menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = () => {
    setIsOpen(false); // Close the menu
  };

  // 3. Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

    if (!mounted) return null;

  return (
    <div className="relative" ref={menuRef}>
      {" "}
      {/* 4. Attach ref here */}
      <button
        onClick={toggleMenu}
        className="bg-slate-600 cursor-pointer py-1 rounded-xl text-white"
      >
        Menu
      </button>
      {isOpen && (
        <div className="absolute top-12 mt-2 right-5 bg-gray-800 text-white shadow-md rounded-sm w-32 p-3">
          <ul className="space-y-2">
            {/* <li className="hover:bg-slate-600">
              <Link
                className="p-2 cursor-pointer"
                href="/home"
                onClick={()=>setIsOpen(false)}
              >
                Home
              </Link>
            </li> */}
            <li className="hover:bg-slate-600">
              <Link
                className="p-2 cursor-pointer"
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
            <li className="hover:bg-slate-600">
              <LogoutButton />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PopupMenu;
