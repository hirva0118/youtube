"use client"

import React, { useEffect, useState } from 'react'
import { getAllVideo } from './actions/videoAction'
import Link from 'next/link';

const Page = () => {

  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(false)

useEffect(()=>{
    const fetchAllVideo = async() => {
      setLoading(true)
    try {
      const result = await getAllVideo({page:1,limit:10})
      if (result?.data) {
          setVideoList(result.data);
        } else {
          setVideoList([]);
        }
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }
  fetchAllVideo()
},[])

  return (
    <div className='min-h-screen h-full bg-black'>
      <p className='text-white text-2xl text-center p-5'>Home page</p>
      {loading ? (
        <p className="text-gray-500">Loading videos...</p>
      ) : videoList.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-3 gap-4 pt-5">
          {videoList.map((video: any) => (
            <Link href={`/watchVideo/${video._id}`} key={video._id}>
            <div
              key={video._id}
              className="w-full bg-gray-800 text-white rounded-lg  p-4"
            >
              <img
                className="w-full h-full object-cover rounded mb-2"
                alt="thumbnail"
                src={video.thumbnail}
              />
              <h3 className="font-semibold">{video.title}</h3>
              <p className="text-sm">{video.description}</p>
            </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No videos found</p>
      )}
    </div>
  )
}

export default Page;
