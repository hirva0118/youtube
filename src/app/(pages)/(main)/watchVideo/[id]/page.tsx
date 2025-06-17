"use client";

import React, { useEffect, useState } from "react";
import { getVideoById, likeDislikeVideo } from "@/app/actions/videoAction";
import {
  addComment,
  deleteComment,
  getComment,
  likeDislikeComment,
} from "@/app/actions/commentAction";
import { getCurrentUser } from "@/app/actions/userActions";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import {
  getUserChannel,
  toggleSubscription,
} from "@/app/actions/subscribeAction";

interface CommentType {
  _id: string;
  content: string;
  isLiked: boolean;
  likeCount: number;
  owner: {
    avatar: string;
    fullName: string;
    username: string;
    _id: string;
  };
}
interface currentUserProp {
  _id: string;
}

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<currentUserProp | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const user = await getCurrentUser();
        console.log("user::", user);
        setCurrentUser(user.user);

        setLoading(true);
        const { id } = await params;
        const videoId = id;

        const result = await getVideoById(videoId);
        setVideo(result?.data || null);
        console.log(video, "videooooo");
        console.log(result, "result");

        if (result?.data?.owner?.username) {
          const res = await getUserChannel(result.data.owner.username);
          console.log("Response from getUserChannel:", res);

          if (res?.success) {
            setIsSubscribed(res.data?.isSubscribed);
          } else {
            console.log(
              "Error fetching channel:",
              res?.error || "Unknown error"
            );
            setIsSubscribed(false); // Handle error case
          }

          setSubscribersCount(res.data.subscribersCount)
        } else {
          console.error("Video owner username is missing!");
          setIsSubscribed(false);
        }
        
      } catch (err) {
        console.error("Failed to fetch video:", err);
      } finally {
        setLoading(false);
      }
    };
    const fetchAllComments = async () => {
      const { id } = await params;
      const videoId = id;
      const res = await getComment(videoId);
      console.log("res:::", res);
      if (res?.success) setComment(res.comments);
      console.log("comment", comment);
    };

   
    fetchVideo();
    fetchAllComments();
  }, []);

  const handleLikeDislikeVideo = async () => {
    try {
      const { id } = await params;
      const videoId = id;
      const result = await likeDislikeVideo(videoId);
      console.log(result);
      const res = await getVideoById(videoId);
      setVideo(res?.data || null);
    } catch (error) {
      console.error("Like/Dislike Error:", error);
    }
  };

  const handlePostComment = async () => {
    try {
      const { id } = await params;
      const videoId = id;
      const result = await addComment(videoId, newComment.trim());
      if (result.success) {
        setNewComment("");
        const updatedComment = await getComment(videoId);
        console.log("updated:::", updatedComment);
        if (updatedComment.success) {
          setComment(updatedComment.comments);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (_id: string) => {
    try {
      const res = await deleteComment(_id);
      if (res.success) {
        const { id } = await params;
        const videoId = id;
        const updatedComment = await getComment(videoId);
        if (updatedComment.success) {
          setComment(updatedComment.comments);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikeDislikeComment = async (commentId: string) => {
    try {
      const result = await likeDislikeComment(commentId);
      console.log(result.data);
      if (result.success) {
        const { id } = await params;
        const videoId = id;
        const updatedComment = await getComment(videoId);
        if (updatedComment.success) {
          setComment(updatedComment.comments);
        }
      }

      // Update the comment list with the updated comment
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleSubscribe = async () => {
    try {
      const result = await toggleSubscription(video.owner._id);
      // setIsSubscribed(!isSubscribed);
      const res = await getUserChannel(video.owner.username);
      if (res.success) {
        setIsSubscribed(res.data.isSubscribed);
      } else {
        setIsSubscribed(res.data.isSubscribed);
      }
      setSubscribersCount(res.data.subscribersCount);

      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMenu = (id: string) => {
    setMenuOpenId((prevId) => (prevId === id ? null : id));
  };

  if (loading) {
    return <p className="text-white p-6">Loading...</p>;
  }

  if (!video) {
    return <p className="text-red-500 p-6">Video not found</p>;
  }

  return (
    <div className="bg-gray-900 min-h-screen px-4 py-8 text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl  p-6 ">
        <video className="w-full rounded-lg" controls src={video.videoFile} />
        <h1 className="text-2xl font-semibold mb-3 mt-2">{video.title}</h1>

        <div className=" flex justify-between pb-4">
          <div className="flex gap-3 items-center">
            <img
              className="w-10 h-10  rounded-full "
              alt="profile"
              src={video.owner.avatar}
            />
            <div>
              <h1 className="text-lg font-semibold">{video.owner.fullName}</h1>
              <p className="text-sm text-gray-300">{subscribersCount} subscribers</p>
            </div>
            {isSubscribed ? (
              <button
                className="bg-slate-600 px-4 py-2 ml-6 cursor-pointer hover:bg-slate-700 text-white rounded-3xl"
                onClick={handleToggleSubscribe}
              >
                Unsubscribe
              </button>
            ) : (
              <button
                className="bg-slate-600 px-4 py-2 ml-6 cursor-pointer hover:bg-slate-700 text-white rounded-3xl"
                onClick={handleToggleSubscribe}
              >
                Subscribe
              </button>
            )}
          </div>
          <div>
            {video.isLiked ? (
              <div className="flex items-center gap-2 pb-3 ">
                <BiSolidLike
                  className="w-7 h-7 cursor-pointer"
                  onClick={handleLikeDislikeVideo}
                />
                <span>{video.likeCount}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 pb-3">
                <BiLike
                  className="w-7 h-7 cursor-pointer"
                  onClick={handleLikeDislikeVideo}
                />
                <span>{video.likeCount}</span>
              </div>
            )}
          </div>
        </div>

        <p className="mb-2">{video.description}</p>

        <div>
          <hr />
          <h2 className="text-lg pb-2 pt-4">Comments</h2>
          {/* Input */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className=" w-full p-2 bg-gray-800 text-white border-b border-gray-600 outline-none"
            />

            <IoSend
              className="w-8 h-8 cursor-pointer"
              onClick={handlePostComment}
            />
          </div>
          <div className="space-y-4">
            {comment && comment.length > 0 ? (
              comment.map((cmt: any) => (
                <div className=" rounded-md" key={cmt._id}>
                  <div className="flex gap-3">
                    <div>
                      <img
                        className="w-10 h-10 rounded-full"
                        alt="name"
                        src={cmt?.owner?.avatar}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p>{cmt?.owner?.fullName}</p>
                      <p className=" text-gray-300">{cmt?.content}</p>
                      <div>
                        {cmt?.isLiked ? (
                          <div className="flex gap-2">
                            <AiFillLike
                              onClick={() => handleLikeDislikeComment(cmt._id)}
                              className="w-5 h-5"
                            />
                            <p>{cmt.likeCount}</p>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <AiOutlineLike
                              onClick={() => handleLikeDislikeComment(cmt._id)}
                              className="w-5 h-5"
                            />
                            <p>{cmt.likeCount}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      {currentUser && currentUser._id === cmt?.owner?._id && (
                        <button
                          onClick={() => toggleMenu(cmt._id)}
                          className="text-white px-2 text-lg cursor-pointer"
                          title="More"
                        >
                          ⋮
                        </button>
                      )}
                      {menuOpenId === cmt._id && (
                        <div className="absolute left-5">
                          <button
                            onClick={() => {
                              handleDeleteComment(cmt._id);
                              setMenuOpenId(null);
                            }}
                            className="block bg-gray-600 w-full px-4 py-1 text-sm hover:bg-gray-500 text-left cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
