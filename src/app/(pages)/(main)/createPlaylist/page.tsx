"use client"

import { createPlaylist } from '@/app/actions/playlistAction';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const Page = () => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false)

    const CreatePlaylist = async() =>{
        const payload = {
            name,description
        }
        setLoading(true)
        try {
            const resp = await createPlaylist(payload);
            if(resp.success){
                setName("");
                setDescription("");
                toast.success("Playlist Created")
                window.location.href="/postvideo";
            }
        } catch (error:any) {
            toast.error(error)
        }finally{
            setLoading(false)
        }

    }

  return (
    <div className="bg-black min-h-screen h-full m-auto pt-20">
      <div className=" text-white  max-w-md mx-auto p-4 border rounded shadow">
        <div className="flex justify-center items-center gap-4 mb-4">
          <h1 className="text-2xl text-center">Create Playlist</h1>
        </div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          className="border w-full p-2 mb-4"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          className="border w-full p-2 mb-4"
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={CreatePlaylist}
          className="bg-blue-500 text-white w-full py-2 rounded cursor-pointer relative"
        >
          {loading && (
            <div className="absolute right-3 sm:right-40 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          Create
        </button>
      </div>
    </div>
  );
}

export default Page
