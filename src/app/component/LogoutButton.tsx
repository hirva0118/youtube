"use client";

import { logout } from "../actions/userActions";

export default function LogoutButton() {
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      alert(result.message);
      window.location.href = "/signin";
    }
  };
  return (
    <div className="bg-black flex justify-end">
      <button
        className="bg-gray-500 text-white py-2 px-3 rounded-sm m-2 cursor-pointer"
        onClick={handleLogout}  
      >
        Logout
      </button>
    </div>
  );
}
