"use client";

import { signin } from "@/app/actions/userActions";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Page = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const result = await signin(values);
      if (result.success) {
        toast.success("Logged in successfully");
        router.push("/home");
      } else {
        toast.error(result?.message || "Invalid credentials");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg p-8 border border-zinc-800">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Please login to continue
        </p>

        {/* Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {() => (
            <Form className="space-y-5">
              {/* Email */}
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="relative w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-70 cursor-pointer"
                disabled={loading}
              >
                {loading && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </span>
                )}
                Login
              </button>
            </Form>
          )}
        </Formik>

        {/* Links */}
        <div className="flex justify-between mt-6 text-sm">
          <Link
            href="/signup"
            className="text-indigo-400 hover:underline font-medium"
          >
            Create an account
          </Link>
          <Link
            href="/changePassword"
            className="text-indigo-400 hover:underline font-medium"
          >
            Change password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
