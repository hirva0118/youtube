"use client";

import { signin } from "@/app/actions/userActions";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Page = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const result = await signin(values);
      if (result.success) {
        toast.success("Logged in successfully");
        window.location.href = "main/home";
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
    <div className="bg-black min-h-screen h-full m-auto mt-20">
      <div className=" text-white  max-w-md mx-auto p-4 border rounded shadow">
        <div className="flex justify-center items-center gap-4 mb-4">
          <h1 className="text-2xl text-center">Login</h1>
        </div>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {() => (
            <Form>
              <div className="mb-4">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="border w-full p-2"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="border w-full p-2"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white w-full py-2 rounded cursor-pointer relative"
                disabled={loading}
              >
                {loading && (
                  <div className="absolute right-3 sm:right-40 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                Login
              </button>
            </Form>
          )}
        </Formik>

        <div className="flex justify-between  mt-4 cursor-pointer text-blue-300 text-sm">
          <Link href="/signup">Create an account</Link>
          <Link href="/changePassword">Change password</Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
