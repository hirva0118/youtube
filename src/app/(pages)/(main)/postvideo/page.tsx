"use client";

import { getUserPlaylist } from "@/app/actions/playlistAction";
import { getCurrentUser } from "@/app/actions/userActions";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface playlistType {
  playlist: [
    {
      _id: string;
      name: string;
      description: string;
    }
  ];
}

const PublishVideo = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState<playlistType | null>(null);

  // Handle video upload success
  const handleVideoUpload = (result: any, widget: any) => {
    if (result.event === "success") {
      setVideoUrl(result.info.secure_url);
      widget.close();
      toast.success("Video added");
    }
  };

  // Handle thumbnail upload success
  const handleThumbnailUpload = (result: any, widget: any) => {
    if (result.event === "success") {
      setThumbnailUrl(result.info.secure_url);
      widget.close();
      toast.success("Thumbnail added");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const videoData = {
      title,
      description,
      videoFile: videoUrl,
      thumbnail: thumbnailUrl,
      duration,
    };

    try {
      const response = await axios.post("/api/video/publishVideo", videoData);
      console.log("Response:", response.data);
      setTitle("");
      setDescription("");
      setDuration(0);
      setThumbnailUrl("");
      setVideoUrl("");
      toast.success("Video published successfully");
      window.location.href = "/myProfile";
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong while publishing the video.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = () => {
    redirect("/createPlaylist");
  };
  const handleAddToPlaylist = async () => {
    setIsAddToPlaylistOpen(!isAddToPlaylistOpen);
    const res = await getCurrentUser();
    console.log("currentuser", res);
    const resp = await getUserPlaylist(res?.user?._id);
    console.log("playlist name in resp:", resp);
    setPlaylistName(resp);
  };

  return (
    <div className="flex bg-black min-h-screen h-full mt-10">
      <div className="max-w-2xl flex-1 m-auto mx-auto p-6 bg-gray-300 rounded-lg shadow-lg">
        <h2 className="text-2xl text-black font-semibold text-center mb-6">
          Publish Your Video
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-black"
            >
              Video Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-black"
            >
              Video Description
            </label>
            <textarea
              id="description"
              placeholder="Enter video description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 text-black bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Duration Input */}
          <div className="space-y-2">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-black"
            >
              Video Duration (in seconds)
            </label>
            <input
              id="duration"
              type="number"
              placeholder="Enter video duration"
              value={duration}
              onChange={(e: any) => setDuration(e.target.value)}
              className="w-full px-4 py-2 text-black bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Video Upload */}
          <div className="flex flex-col items-center space-y-4">
            <CldUploadWidget
              signatureEndpoint="/api/cloudinary"
              onSuccess={handleVideoUpload}
              options={{
                resourceType: "video",
                cropping: false,
                croppingAspectRatio: 1,
                maxFileSize: 50 * 1024 * 1024,
                clientAllowedFormats: ["mp4"],
                maxChunkSize: 40 * 1024 * 1024,
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open?.()}
                  className="w-full py-2 px-4 cursor-pointer bg-white text-black border border-black font-semibold rounded-lg hover:bg-gray-200 focus:outline-none"
                >
                  Upload Video
                </button>
              )}
            </CldUploadWidget>

            {/* Thumbnail Upload */}
            <CldUploadWidget
              signatureEndpoint="/api/cloudinary"
              onSuccess={handleThumbnailUpload}
              options={{
                cropping: true,
                croppingAspectRatio: 1,
                maxFileSize: 50 * 1024 * 1024,
                maxImageFileSize: 50 * 1024 * 1024,
                clientAllowedFormats: ["jpg", "jpeg", "png"],
                maxChunkSize: 20 * 1024 * 1024,
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open?.()}
                  className="w-full py-2 px-4 cursor-pointer bg-white text-black border border-black font-semibold rounded-lg hover:bg-gray-200 focus:outline-none"
                >
                  Upload Thumbnail
                </button>
              )}
            </CldUploadWidget>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 justify-center">
            <button
              type="submit"
              className="relative w-full py-3 px-6 cursor-pointer bg-white text-black border border-blue-800 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none"
            >
              {loading && (
                <div className="absolute right-3 sm:right-56 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              Publish Video
            </button>
            <button
              onClick={handleAddToPlaylist}
              className="relative w-full py-3 px-6 cursor-pointer bg-white text-black border border-blue-800 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none"
            >
              Publish Video and add to Playlist
            </button>
          </div>
          <div className="flex items-end justify-end">
            {isAddToPlaylistOpen && (
              <select
                className="cursor-pointer py-2 border border-gray-600 rounded-md bg-white text-black"
                title="playlistName"
                value={playlistName?.playlist[0].name}
                onChange={(e) => setPlaylistName(e.target.value)}
              >
                {playlistName?.playlist.map((play) => (
                  <option key={play._id} value="name">
                    {play.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex justify-end items-end">
            <button
              onClick={handleCreatePlaylist}
              className="hover:text-blue-800 border-b border-slate-600 text-black cursor-pointer"
            >
              Create a playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishVideo;
