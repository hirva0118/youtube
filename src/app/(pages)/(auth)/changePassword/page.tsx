"use client";

import { changePassword } from "@/app/actions/userActions";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setLoading(true);
    const payload = {
      oldPassword,
      newPassword,
    };
    try {
      const result = await changePassword(payload);
      if (result.success) {
        toast.success("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(result?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen px-4 py-10">
      <div className="w-full max-w-md mx-auto bg-zinc-900 rounded-2xl shadow-lg p-8 border border-zinc-800">
        <h1 className="text-2xl font-semibold text-center text-white mb-6">
          Change Password
        </h1>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          className="w-full mb-4 px-3 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          className="w-full mb-4 px-3 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handleChangePassword}
          className="relative w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
          disabled={loading}
        >
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          Change Password
        </button>

        <div className="flex justify-end mt-4 text-blue-400 text-sm">
          <Link href="/signin" className="hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
