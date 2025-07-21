"use client";
import { deletePlaylist, getUserPlaylist } from "@/app/actions/playlistAction";
import { getUserChannel } from "@/app/actions/subscribeAction";
import { getCurrentUser } from "@/app/actions/userActions";
import {
  deleteVideo,
  getVideo,
  publishToggleVideo,
} from "@/app/actions/videoAction";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoMdPlayCircle } from "react-icons/io";

interface currentUserType {
  user: {
    coverImage: string;
    avatar: string;
    fullName: string;
  };
}

interface subscribeType {
  subscribersCount: number;
}

interface playlistType {
  playlist: {
    _id: string;
    name: string;
    description: string;
  }[];
}

const Page = () => {
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortType, setSortType] = useState(undefined);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [menuPlaylistOpenId, setMenuPlaylistOpenId] = useState<string | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<currentUserType | null>(null);
  const [subscribeData, setSubscribeData] = useState<subscribeType | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"videos" | "playlists">("videos");
  const [playlistMyProfile, setPlaylistMyProfile] = useState<playlistType>({
    playlist: [],
  });

  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const menuPlaylistRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  const getCurrentUserData = async () => {
    try {
      const res = await getCurrentUser();
      console.log(res);
      setCurrentUser(res);

      const response = await getUserChannel(res?.user?.username);
      console.log(response, "response");
      setSubscribeData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserPlaylistVideo = async () => {
    try {
      const res = await getCurrentUser();
      const resp = await getUserPlaylist(res.user._id);
      setPlaylistMyProfile(resp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVideos();
    getCurrentUserData();
    getUserPlaylistVideo();
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

  const handlePlaylistdelete = async (id: string) => {
    try {
      await deletePlaylist(id);
      await getUserPlaylistVideo();
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

  const toggleMenuPlaylist = (id: string) => {
    setMenuPlaylistOpenId((prev) => (prev === id ? null : id));
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuPlaylistOpenId &&
        menuPlaylistRefs.current[menuPlaylistOpenId] &&
        !menuPlaylistRefs.current[menuPlaylistOpenId]?.contains(
          event.target as Node
        )
      ) {
        setMenuPlaylistOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuPlaylistOpenId]);

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
    <div className="min-h-screen h-full bg-black">
      <div className=" max-w-full mx-auto p-3 sm:p-6 rounded-lg shadow-md">
        <div className="flex relative pb-4 justify-center items-center pt-8">
          <img
            className=" h-64 w-4xl border border-2 border-slate-500 p-1"
            alt="coverImage"
            src={currentUser?.user?.coverImage}
          />
          <div className="flex flex-col gap-2 items-center absolute bottom-4 right-1/2 transform translate-x-1/2 translate-y-1/2">
            <img
              className="border border-2 border-black h-32 w-32 sm:h-44 sm:w-44 rounded-full"
              alt="avatar"
              src={currentUser?.user?.avatar}
            />
            <p className="text-xl text-white">{currentUser?.user.fullName}</p>
            <p className="text-white">{subscribeData?.subscribersCount} Subscribers</p>
          </div>
        </div>
        {/* Filters and Search */}
        <br />

        {/* Sort and filter section */}
        <div className=" mt-24 flex flex-col gap-2 md:flex-row justify-between mb-10">
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="Search videos..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2 max-w-[60%] sm:max-w-lg border border-gray-600 rounded-md text-white bg-black"
              disabled={activeTab === "playlists"}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-sm border border-gray-400 text-white rounded-md cursor-pointer hover:bg-blue-500"
              disabled={activeTab === "playlists"}
            >
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-2 ">
            {/* Sort By */}
            <select
              title="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm h-10 px-2 border border-gray-600 rounded-md text-white bg-black cursor-pointer"
              disabled={activeTab === "playlists"}
            >
              <option value="">Sort by</option>
              <option value="createdAt">Date Created</option>
              <option value="views">Views</option>
              <option value="duration">Duration</option>
            </select>

            {/* Sort Type */}
            <select
              title="sortType"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="text-sm h-10 px-2 border border-gray-600 rounded-md text-white bg-black cursor-pointer"
              disabled={activeTab === "playlists"}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>

            {/* Apply Filter */}
            <button
              onClick={handleSearch}
              className="text-sm h-10 px-4 border border-gray-400 text-white rounded-md cursor-pointer hover:bg-blue-500"
              disabled={activeTab === "playlists"}
            >
              Apply Filter
            </button>
          </div>
        </div>

        {/* Video Cards */}
        {loading ? (
          <p className="text-gray-500"></p>
        ) : videoList.length >= 0 ? (
          <>
            <div className="flex justify-center gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded-md border-b cursor-pointer ${
                  activeTab === "videos"
                    ? "bg-slate-900 hover:bg-slate-700 text-white"
                    : "bg-black text-white"
                }`}
                onClick={() => setActiveTab("videos")}
              >
                My Videos
              </button>
              <button
                className={`px-4 py-2 rounded-md border-b cursor-pointer ${
                  activeTab === "playlists"
                    ? "bg-slate-900 hover:bg-slate-700 text-white"
                    : "bg-black text-white"
                }`}
                onClick={() => setActiveTab("playlists")}
              >
                My Playlists
              </button>
            </div>

            {activeTab === "videos" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 gap-4 pt-5">
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
            )}

            {activeTab === "playlists" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 gap-4 pt-5">
                {playlistMyProfile.playlist.map((playlist: any) => (
                  <div
                    key={playlist._id}
                    className=" bg-gray-800 text-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex gap-2">
                      <div>
                        <IoMdPlayCircle className="w-10 h-10" />
                      </div>
                      <div className="flex w-full justify-between">
                        <div>
                          <Link
                            href={`/watchPlaylist/${playlist._id}`}
                            key={playlist._id}
                          >
                            <div>
                              <h3 className="text-lg font-bold mb-1">
                                {playlist.name}
                              </h3>
                              <p className="text-sm mb-2">
                                {playlist.description}
                              </p>
                            </div>
                          </Link>
                        </div>

                        <div
                          className="relative"
                          ref={(ref) =>
                            (menuPlaylistRefs.current[playlist._id] = ref)
                          }
                        >
                          <button
                            onClick={() => toggleMenuPlaylist(playlist._id)}
                            className="text-white px-2 text-lg cursor-pointer"
                            title="More"
                          >
                            ⋮
                          </button>

                          {menuPlaylistOpenId === playlist._id && (
                            <div className="absolute right-0 mt-1 w-20 bg-slate-700 text-white rounded z-10">
                              <button
                                onClick={() => {
                                  handlePlaylistdelete(playlist._id);
                                  setMenuPlaylistOpenId(null);
                                }}
                                className="block w-full px-4 py-1 font-semibold text-sm hover:bg-gray-600 text-left cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">No videos found</p>
        )}
      </div>
    </div>
  );
};

export default Page;
