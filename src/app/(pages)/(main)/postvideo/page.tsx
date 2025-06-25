
"use client";

import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

const PublishVideo = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);

  // Handle video upload success
  const handleVideoUpload = (result: any, widget: any) => {
    if (result.event === "success") {
      setVideoUrl(result.info.secure_url);
      widget.close();
      alert("Video Added");
    }
  };

  // Handle thumbnail upload success
  const handleThumbnailUpload = (result: any, widget: any) => {
    if (result.event === "success") {
      setThumbnailUrl(result.info.secure_url);
      widget.close();
      alert("Thumbnail Added");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      alert("Video Posted Successfully");
      window.location.href = "/myProfile";
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong while publishing the video.");
    }
  };

  return (
    <div className="bg-black min-h-screen h-full mt-10">
      <div className="max-w-2xl mx-auto p-6 bg-gray-300 rounded-lg shadow-lg">
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
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 px-6 cursor-pointer bg-white text-black border border-blue-800 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none"
            >
              Publish Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishVideo;

// import React from 'react'

// const page = () => {
//   return (
//     <div>
//       <p>hi</p>
//     </div>
//   )
// }

// export default page
