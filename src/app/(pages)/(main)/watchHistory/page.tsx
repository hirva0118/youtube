"use client";

import {
  deleteFromWatchHistory,
  getFromWatchHistory,
} from "@/app/actions/videoAction";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface WatchVideo {
  _id: string;
  videoFile: string;
  title: string;
  thumbnail: string;
  owner: {
    avatar: string;
    fullName: string;
  };
}

const Page = () => {
  const [watchHistory, setWatchHistory] = useState<WatchVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    const getVideoFromWatchHistory = async () => {
      setLoading(true);
      try {
        const res = await getFromWatchHistory();
        console.log(res);
        setWatchHistory(res.data[0].watchHistory || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getVideoFromWatchHistory();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 bg-black">
        <div className=" flex justify-center items-center p-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Loading Page...</p>
          </div>
        </div>
      </div>
    );
  }

  const toggleMenu = (id: string) => {
    setMenuOpenId((prevId) => (prevId === id ? null : id));
  };

  const handleDelete = async (id: string) => {
    try {
      const resp = await deleteFromWatchHistory(id);
      const res = await getFromWatchHistory();
      console.log(res);
      setWatchHistory(res.data[0].watchHistory || []);
      return resp.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-black">
      <h1 className="text-center pt-8 text-2xl font-semibold mb-3  text-white">
        Watch History
      </h1>
      <ul className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 gap-4 pt-5">
        {watchHistory.map((watch, index) => (
          <Link href={`/watchVideo/${watch._id}`} key={index}>
            <div className="w-full h-full mx-auto bg-gray-800 rounded-lg p-3 ">
              <img className="w-full h-40" alt="image" src={watch.thumbnail} />
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <img
                    className="w-10 h-10 rounded-full"
                    alt="avatar"
                    src={watch.owner.avatar}
                  />
                  <div className="flex flex-col mt-2">
                    <h3 className="font-semibold text-white">{watch.title}</h3>
                    <p className="text-sm text-slate-400">
                      {watch.owner.fullName}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleMenu(watch._id);
                    }}
                    className="text-white px-2 text-lg cursor-pointer "
                    title="More"
                  >
                    ⋮
                  </button>
                  {menuOpenId === watch._id && (
                    <div className="absolute right-0 mt-1 w-20 bg-slate-700 text-white rounded z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDelete(watch._id);
                          setMenuOpenId(null);
                        }}
                        className="block w-full px-2 py-2 font-semibold text-sm hover:bg-gray-600 text-center cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Page;
