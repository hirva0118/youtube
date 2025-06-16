"use client";

import { signin } from "@/app/actions/userActions";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const payload = {
      email,
      password,
    };
    try {
      const result = await signin(payload);
      if (result.success) {
        alert(result.message);
        setEmail("");
        setPassword("");
        window.location.href = "/";
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
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
          className="bg-blue-500 text-white w-full py-2 rounded cursor-pointer"
        >
          Login
        </button>
        <div className="flex justify-end mt-4 cursor-pointer text-blue-300 text-sm">
          <Link href="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
