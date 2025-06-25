"use client";

import { signin } from "@/app/actions/userActions";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";


const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    const payload = {
      email,
      password,
    };
    try {
      setLoading(true)
      const result = await signin(payload);
      if (result.success) {
        setEmail("");
        setPassword("");
        toast.success("Logged in successfully");
        window.location.href = "/";
      } else {
        alert(result.message);
      }
    } catch (error:any) {
      console.log(error);
      toast.error(error);

    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="bg-black min-h-screen h-full m-auto mt-20">
      <div className=" text-white  max-w-md mx-auto p-4 border rounded shadow">
        <div className="flex justify-center items-center gap-4 mb-4">
          <h1 className="text-2xl text-center">Login</h1>
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="border w-full p-2 mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          className="border w-full p-2 mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full py-2 rounded cursor-pointer relative"
        >
          {loading && (
            <div className="absolute right-3 sm:right-40 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          Login
        </button>
        <div className="flex justify-between  mt-4 cursor-pointer text-blue-300 text-sm">
          <Link href="/signup">Create an account</Link>
          <Link href="/changePassword">Change password</Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
