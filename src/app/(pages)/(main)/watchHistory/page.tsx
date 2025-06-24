"use client";

import { getFromWatchHistory } from "@/app/actions/videoAction";
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
  useEffect(() => {
    const getVideoFromWatchHistory = async () => {
      const res = await getFromWatchHistory();
      console.log(res);
      setWatchHistory(res.data[0].watchHistory || []);
    };
    getVideoFromWatchHistory();
  }, []);

  return (
    <div>
      <h1 className="text-center pt-3 text-2xl font-semibold mb-3 mt-2">
        Watch History
      </h1>
      <ul className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 gap-4 pt-5">
        {watchHistory.map((watch, index) => (
          <Link href={`/watchVideo/${watch._id}`} key={index}>
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-3 ">
              
              <img className="w-sm h-40" alt="image" src={watch.thumbnail} />
              <div className="flex gap-2 items-center">
                <img
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                  src={watch.owner.avatar}
                />
                <div className="flex flex-col">
                  <h3 className="font-semibold">{watch.title}</h3>
                  <p className="text-sm text-slate-400">
                    {watch.owner.fullName}
                  </p>
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
