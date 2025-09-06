"use client";

import React, { useState } from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { signup } from "@/app/actions/userActions";
import Link from "next/link";

const Page = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);

    const payload = {
      username,
      fullName,
      password,
      email,
      avatar,
      coverImage,
    };

    const result = await signup(payload);
    console.log(result);

    if (result.success) {
      alert(result.message);
      setUsername("");
      setFullName("");
      setPassword("");
      setEmail("");
      setAvatar("");
      setCoverImage("");
      setLoading(false);
      window.location.href = "/signin";
    } else {
      alert(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen px-4 py-10">
      <div className="w-full max-w-md mx-auto bg-zinc-900 rounded-2xl shadow-lg p-8 border border-zinc-800 h-full">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Create Account ✨
        </h1>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Sign up to get started
        </p>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          className="w-full p-3 mb-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          className="w-full p-3 mb-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          onChange={(e) => setFullName(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="w-full p-3 mb-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full p-3 mb-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Avatar Upload */}
        <label className="text-gray-300 text-sm mb-2 block">Avatar</label>
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary"
          onSuccess={(result: any, { widget }) => {
            setAvatar(result.info.secure_url);
            widget.close();
          }}
          options={{
            cropping: true,
            croppingAspectRatio: 1,
            maxFileSize: 5000000,
            clientAllowedFormats: ["jpg", "jpeg", "png"],
          }}
        >
          {({ open }) => (
            <button
              className="w-full p-3 mb-4 rounded-xl bg-zinc-800 text-gray-300 border border-zinc-700 hover:bg-zinc-700 transition"
              type="button"
              onClick={() => open()}
            >
              Upload Avatar
            </button>
          )}
        </CldUploadWidget>
        {avatar && (
          <img
            src={avatar}
            alt="Avatar Preview"
            className="w-24 h-24 object-cover rounded-full mb-4 border border-zinc-700"
          />
        )}

        {/* Cover Image Upload */}
        <label className="text-gray-300 text-sm mb-2 block">Cover Image</label>
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary"
          onSuccess={(result: any, { widget }) => {
            setCoverImage(result.info.secure_url);
            widget.close();
          }}
          options={{
            cropping: true,
            croppingAspectRatio: 16 / 9,
            clientAllowedFormats: ["jpg", "jpeg", "png"],
          }}
        >
          {({ open }) => (
            <button
              className="w-full p-3 mb-4 rounded-xl bg-zinc-800 text-gray-300 border border-zinc-700 hover:bg-zinc-700 transition"
              type="button"
              onClick={() => open()}
            >
              Upload Cover Image
            </button>
          )}
        </CldUploadWidget>
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover Preview"
            className="w-full h-32 object-cover mb-4 rounded-lg border border-zinc-700"
          />
        )}

        {/* Submit Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="relative w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-70"
        >
          {loading && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </span>
          )}
          Register
        </button>

        {/* Already have account */}
        <div className="mt-6 text-center text-sm">
          <Link
            href="/signin"
            className="text-indigo-400 hover:underline font-medium"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
