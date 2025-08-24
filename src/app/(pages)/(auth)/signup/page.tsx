"use client";

import React, { useState } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
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
    setLoading(true)
    
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
      setLoading(false)
      window.location.href = "/signin";
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="bg-black min-h-screen h-full">
      <div className="text-white mt-20 max-w-md mx-auto p-4 border rounded shadow mb-10">
        <div className="flex justify-center items-center gap-4 mb-4">
          <h1 className="text-2xl text-center">Signup</h1>
        </div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          className="border w-full p-2 mb-4"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          className="border w-full p-2 mb-4"
          onChange={(e) => setFullName(e.target.value)}
        />

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

        <label className="mb-1">Avatar</label>
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary"
          onSuccess={(result:any, { widget }) => {
            setAvatar(result.info.secure_url);
            widget.close();
          }}
          options={{
            cropping: true,
            croppingAspectRatio: 1,
            maxFileSize: 5000000,
            maxImageFileSize: 5000000,
            clientAllowedFormats: ["jpg", "jpeg", "png"],
          }}
        >
          {({ open }) => (
            <button
              className="border p-2 mb-4 w-full text-left"
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
            className="w-24 h-24 object-cover mb-4"
          />
        )}

        <label className="mb-1">Cover Image</label>
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
              className="border p-2 mb-4 w-full text-left"
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
            className="w-full h-32 object-cover mb-4"
          />
        )}

        <button
          onClick={handleSignup}
          className="bg-blue-500 text-white w-full py-2 rounded cursor-pointer relative"
        >
          {loading && (
            <div className="absolute right-3 sm:right-36 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          Register
        </button>
        <div className="flex justify-end mt-4 cursor-pointer text-blue-300 text-sm ">
          <Link href="/signin">Already have an account?</Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
