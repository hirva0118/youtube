"use client";

import {
  getPlaylistById,
  removeVideoFromPlaylist,
} from "@/app/actions/playlistAction";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdPlayCircle } from "react-icons/io";

interface playlistType {
  playlist: {
    name: string;
    description: string;
    videos: {
      _id: string;
      videoFile: string;
      thumbnail: string;
      title: string;
      description: string;
    }[];
  };
}
const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const [playlistData, setPlaylistData] = useState<playlistType | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const playlistById = async () => {
    try {
      setLoading(true);
      const { id } = await params;
      const playlistId = id;
      const resp = await getPlaylistById(playlistId);
      setPlaylistData(resp);
      console.log(resp);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    playlistById();
  }, []);


  const toggleMenu = (id: string) => {
    setMenuOpenId((prevId) => (prevId === id ? null : id));
  };

  const handleDelete = async (videoId: string) => {
    try {
      const { id } = await params;
      const playlistId = id;
      await removeVideoFromPlaylist(playlistId, videoId);
      await playlistById();
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <div className="pt-20 bg-black">
      <div className="flex flex-col md:flex-row p-4 gap-6">
        <div className="h-full w-full md:w-[40%] bg-gradient-to-b from-gray-800 to-transparent text-white rounded-lg shadow-md p-2">
          <div className="h-28 md:h-64 flex gap-2 p-2">
            <div>
              <IoMdPlayCircle className="w-16 h-16" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl">{playlistData?.playlist.name}</h3>
              <p className="text-md text-slate-400">
                {playlistData?.playlist.description}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[60%]">
          <div className="">
            {(playlistData?.playlist?.videos?? []).length > 0 ? (
              <div>
                {playlistData?.playlist.videos.map((vid) => (
                  <div
                    className="flex justify-between max-h-md bg-gray-800 text-white rounded-lg shadow-md p-3 relative mb-3"
                    key={vid._id}
                  >
                    <div className="w-full h-full">
                      <Link href={`/watchVideo/${vid._id}`}>
                        <div className="flex flex-col md:flex-row gap-2">
                          {/* Thumbnail */}
                          <div className="w-full md:w-48 h-32 flex-shrink-0">
                            <img
                              className="w-full h-full object-cover rounded mb-2"
                              alt="thumbnail"
                              src={vid.thumbnail}
                            />
                          </div>

                          {/* Text content */}
                          <div className="p-2 flex flex-col justify-center w-full">
                            <h3 className="text-xl font-semibold break-words">
                              {vid.title}
                            </h3>
                            <p className="text-lg break-words text-slate-400">
                              {vid.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => toggleMenu(vid._id)}
                        className="text-white px-2 text-lg cursor-pointer"
                        title="More"
                      >
                        ⋮
                      </button>

                      {menuOpenId === vid._id && (
                        <div className="absolute right-0 mt-1 w-20 bg-slate-700 text-white rounded z-10">
                          <button
                            onClick={() => {
                              handleDelete(vid._id);
                              setMenuOpenId(null);
                            }}
                            className="block w-full px-3 py-1 font-semibold text-sm hover:bg-gray-600 text-left cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <p className=" text-slate-600 text-lg ">No Videos added</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
