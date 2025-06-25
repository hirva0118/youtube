"use client";

import { logout } from "../actions/userActions";

export default function LogoutButton() {
  const handleLogout = async () => {
    const result = await logout();
    console.log(result,"logout")
    if (result.success) {
      alert(result.message);
      window.location.href = "/signin";
    }
  };
  return (
    <div className=" ">
      <button
        className="pl-2 text-sm cursor-pointer w-full text-left"
        onClick={handleLogout}  
      >
        Logout
      </button>
    </div>
  );
}
