"use client";

import React, { useEffect, useState } from "react";
import { getAllVideo } from "./actions/videoAction";
import Link from "next/link";

const Page = () => {
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortType, setSortType] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");

  const fetchAllVideo = async (query = "") => {
    setLoading(true);
    try {
      const result = await getAllVideo({
        page: 1,
        limit: 10,
        query: query || undefined,
        sortBy: sortBy || undefined,
        sortType: sortType || undefined,
      });

      if (result?.data) {
        setVideoList(result.data);
      } else {
        setVideoList([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVideo();
  }, []);

  const handleSearch = () => {
    setSearchQuery(inputText.trim());
    fetchAllVideo(inputText.trim());
  };

  return (
    <div className="min-h-screen h-full bg-black">
      <p className="text-white text-2xl text-center p-5">Home page</p>

      <div className="flex p-2 flex-col gap-2 sm:flex-row justify-end mb-10">
        <select
          title="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="cursor-pointer py-2 sm:mr-2 border border-gray-300 rounded-md text-slate-300 bg-black"
        >
          <option value="">Sort by</option>
          <option value="createdAt">Date Created</option>
          <option value="views">Views</option>
          <option value="duration">Duration</option>
        </select>

        <select
          title="sortType"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="cursor-pointer py-2 sm:mr-2 border border-gray-300 text-slate-300 rounded-md  bg-black"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
        >
          Apply Filter
        </button>
      </div>

      <div className="mb-6 p-2 flex gap-2">
        <input
          type="text"
          placeholder="Search videos..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2 max-w-[60%] sm:max-w-md border border-gray-300 rounded-md text-white bg-black"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white cursor-pointer rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading videos...</p>
      ) : videoList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 gap-4 pt-5">
          {videoList.map((video: any) => (
            <Link href={`/watchVideo/${video._id}`} key={video._id}>
              <div
                key={video._id}
                className="w-full h-full bg-gray-800 text-white rounded-lg  p-3"
              >
                <img
                  className="w-full h-48 rounded mb-4"
                  alt="thumbnail"
                  src={video.thumbnail}
                />
                <div className="flex gap-2 items-center">
                  <img
                    className="w-10 h-10 rounded-full"
                    alt="avatar"
                    src={video.owner.avatar}
                  />
                  <div className="flex flex-col">
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-slate-400">{video.owner.fullName}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No videos found</p>
      )}
    </div>
  );
};

export default Page;
