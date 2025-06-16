import { Like } from "@/models/like.model";
import { Video } from "@/models/video.model";
import {  getUserFromRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

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

    const user = await getUserFromRequest();

    const video = await Video.findById(videoId);

    if (!(video || video.isPublished)) {
      throw new Error("Video not found");
    }

    const alreadyLiked = await Like.find({
      video: videoId,
      likedBy: user._id,
    });

    if (alreadyLiked && alreadyLiked.length > 0) {
      await Like.findByIdAndDelete(alreadyLiked[0]._id, { new: true });
      return NextResponse.json(
        { success: true, message: "Disliked successfully", alreadyLiked },
        { status: 200 }
      );
    }

    const like = await Like.create({
      video: videoId,
      likedBy: user._id,
    });
    if (!like) {
      throw new Error("Unable to Like video");
    }

    return NextResponse.json(
      { success: true, message: "Liked successfully", like },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
