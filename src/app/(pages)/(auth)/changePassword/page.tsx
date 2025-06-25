'use client'

import { changePassword } from '@/app/actions/userActions';
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const Page = () => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword , setNewPassword ] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChangePassword = async () => {
      setLoading(true)
        const payload ={
            oldPassword,newPassword
        }
        try {

            const result = await changePassword(payload)
            if(result.success){
                toast.success("Passowrd changed successfully")
                setOldPassword("");
                setNewPassword("")
            }else{
                toast.error("Something went wrong")
            }
        } catch (error) {
          toast.error("Failed")
            console.log(error)
        }finally{
          setLoading(false)
        }
    }

  return (
    <div className="mt-20 max-w-md mx-auto p-4 border rounded shadow">
      <div className="flex justify-center items-center gap-4 mb-4">
        <h1 className="text-2xl text-center">Change password</h1>
      </div>
      <input
        type="text"
        placeholder="Old Password"
        value={oldPassword}
        className="border w-full p-2 mb-4"
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="text"
        placeholder="New Password"
        value={newPassword}
        className="border w-full p-2 mb-4"
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button
        onClick={handleChangePassword}
        className="bg-blue-500 text-white w-full py-2 rounded cursor-pointer relative"
      >
        {loading && (
          <div className="absolute right-3 sm:right-28 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        Change Password
      </button>
      <div className="flex justify-end  mt-4 cursor-pointer text-blue-300 text-sm">
        <Link href="/signin">Back to Login</Link>
      </div>
    </div>
  );
}

export default Page
