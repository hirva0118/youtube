import { Comment } from "@/models/comment.model";
import { Like } from "@/models/like.model";
import User from "@/models/user.model";
import { getUserFromRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  const { id } = await params;
  const commentId = id;
  
  try {
    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      throw new Error("Invalid commentId");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const user = await getUserFromRequest();

    // Check if the user already liked the comment
    const alreadyLiked = await Like.findOne({
      comment: commentId,
      likedBy: user._id,
    });

    if (alreadyLiked) {
      // If user already liked, remove the like (unlike)
      await Like.findOneAndDelete({
        comment: commentId,
        likedBy: user._id,
      });
      return NextResponse.json(
        { success: true, message: "Disliked successfully" },
        { status: 200 }
      );
    }

    // If the user hasn't liked the comment yet, add a new like
    const like = await Like.create({
      comment: commentId,
      likedBy: user._id,
    });

    if (!like) {
      throw new Error("Unable to like comment");
    }

    return NextResponse.json(
      { success: true, message: "Liked successfully", like },
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
