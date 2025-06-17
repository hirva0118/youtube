import { Comment } from "@/models/comment.model";
import { Video } from "@/models/video.model";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getUserFromRequest } from "@/utils/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  const { id } = await params;
  const videoId = id;
  try {
    if (!videoId) {
      throw new Error("VideoId not provided");
    }

    const videoFound = await Video.findById(videoId);
    if (!videoFound) {
      throw new Error("Video not found");
    }

    const user = await getUserFromRequest();
    if (!user) {
      throw new Error("Unauthorized");
    }
    // console.log(user, "userrrr");

    const comments = await Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
                _id:1
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: {
            $first: "$owner",
          },
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "comment",
          as: "likes",
        },
      },
      {
        $addFields:{
          likeCount:{$size: "$likes"},
        },
      },
      {
        $addFields:{
          isLiked:{
            $in:[user._id,"$likes.likedBy"],
          }
        }
      }
    ]);

    if (!comments) {
      throw new Error("Failed to get comments");
    }

    return NextResponse.json(
      {
        success: true,
        message: "comments fetched successfully",
        comments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  const { id } = await params;
  const videoId = id;
  try {
    if (!videoId) {
      throw new Error("VideoId not provided");
    }

    const body = await request.json();
    const { comment } = body;

    const user = await getUserFromRequest();

    if (!comment) {
      throw new Error("Please provide comment");
    }

    const newComment = await Comment.create({
      video: videoId,
      content: comment,
      owner: user._id,
    });
    if (!newComment) {
      throw new Error("Failed to add comment");
    }

    return NextResponse.json(
      { success: true, message: "Comment added successfully", newComment },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const commentId = id;

    if (!commentId.trim()) {
      throw new Error("commentId not provided");
    }

    const deleteComment = await Comment.findByIdAndDelete(commentId);
    if (!deleteComment) {
      throw new Error("Failed to delete comment");
    }

    return NextResponse.json(
      { success: true, message: "Comment deleted successfully", deleteComment },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
