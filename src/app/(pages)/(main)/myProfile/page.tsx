"use client";
import {
  deleteVideo,
  getVideo,
  publishToggleVideo,
} from "@/app/actions/videoAction";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Page = () => {
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortType, setSortType] = useState(undefined);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const fetchVideos = async (query = "") => {
    setLoading(true);
    try {
      const response = await getVideo({
        page: 1,
        limit: 10,
        query: query || undefined,
        sortBy: sortBy || undefined,
        sortType: sortType || undefined,
      });

      setVideoList(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSearch = () => {
    setSearchQuery(inputText.trim());
    fetchVideos(inputText.trim());
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVideo(id);
      await fetchVideos();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePublishToggle = async (id: string) => {
    try {
      await publishToggleVideo(id);
      await fetchVideos();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMenu = (id: string) => {
    setMenuOpenId((prevId) => (prevId === id ? null : id));
  };

 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpenId &&
        menuRefs.current[menuOpenId] &&
        !menuRefs.current[menuOpenId]?.contains(event.target as Node)
      ) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenId]);

  return (
    <div className="min-h-screen h-full bg-black">
      <div className=" max-w-full mx-auto p-3 sm:p-6 rounded-lg shadow-md">
        {/* Filters and Search */}
        <h2 className="text-xl font-semibold mb-4">My Uploaded Videos</h2>

        {/* Sort and filter section */}
        <div className="flex flex-col gap-2 sm:flex-row justify-end mb-10">
          <select
            title="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cursor-pointer py-2 sm:mr-2 border border-gray-300 rounded-md text-white bg-black"
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
            className="cursor-pointer py-2 sm:mr-2 border border-gray-300 rounded-md text-white bg-black"
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

        {/* Search Bar */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Search videos..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2 max-w-[60%] sm:max-w-md border border-gray-300 rounded-md text-white bg-black"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {/* Video Cards */}
        {loading ? (
          <p className="text-gray-500">Loading videos...</p>
        ) : videoList.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-3 gap-4 pt-5">
            {videoList.map((video: any) => (
              <div
                key={video._id}
                className="w-full h-full bg-gray-800 text-white rounded-lg shadow-md p-3 relative"
              >
                <Link href={`/watchVideo/${video._id}`}>
                  <img
                    className="w-full h-40 object-cover rounded mb-2"
                    alt="thumbnail"
                    src={video.thumbnail}
                  />
                </Link>

                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm">{video.description}</p>
                  </div>

                  {/* 3-dot menu */}
                  <div
                    className="relative"
                    ref={(ref) => (menuRefs.current[video._id] = ref)}
                  >
                    <button
                      onClick={() => toggleMenu(video._id)}
                      className="text-white px-2 text-lg cursor-pointer"
                      title="More"
                    >
                      ⋮
                    </button>

                    {menuOpenId === video._id && (
                      <div className="absolute right-0 mt-1 w-28 bg-slate-700 text-white rounded z-10">
                        <button
                          onClick={() => {
                            handleDelete(video._id);
                            setMenuOpenId(null);
                          }}
                          className="block w-full px-4 py-1 font-semibold text-sm hover:bg-gray-600 text-left cursor-pointer"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            handlePublishToggle(video._id);
                            setMenuOpenId(null);
                          }}
                          className="block w-full px-4 py-1 font-semibold text-sm hover:bg-gray-600 text-left cursor-pointer"
                        >
                          {video.isPublished ? "Archive" : "Publish"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No videos found</p>
        )}
      </div>
    </div>
  );
};

export default Page;
