'use client'

import { changePassword } from '@/app/actions/userActions';
import React, { useState } from 'react'

const Page = () => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword , setNewPassword ] = useState("")

    const handleChangePassword = async () => {
        const payload ={
            oldPassword,newPassword
        }
        try {
            const result = await changePassword(payload)
            if(result.success){
                alert(result.message)
                setOldPassword("");
                setNewPassword("")
            }else{
                alert(result.message)
            }
        } catch (error) {
            console.log(error)
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
        className="bg-blue-500 text-white w-full py-2 rounded cursor-pointer"
      >
        Change Password
      </button>
      
    </div>
  )
}

export default Page
