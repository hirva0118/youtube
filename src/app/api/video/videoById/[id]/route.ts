// import User from "@/models/user.model";
import { Like } from "@/models/like.model";
import User from "@/models/user.model";
import { Video } from "@/models/video.model";
import { getUserFromApiRequest, getUserFromRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const videoId = id;

    const user = await getUserFromRequest();

    // console.log(id, "id");

    if (!videoId.trim()) {
      throw new Error("VideoId not Provided");
    }

    const video = await Video.findById(videoId)
      .populate("owner", "_id username fullName avatar coverImage email", User)
      .lean();

    if (!video) {
      throw new Error("Video not found");
    }

    const likes = await Like.aggregate([
      { $match: { video: new mongoose.Types.ObjectId(videoId) } },
      { $group: { _id: "$video", likeCount: { $sum: 1 } } },
    ]);

    const userLiked = await Like.exists({
      video: videoId,
      likedBy: user._id,
    });
    // console.log("userLiked:",userLiked)

    return NextResponse.json(
      {
        success: true,
        message: "Video Fetched successfully",
        data: {
          ...video,
          likeCount: likes[0]?.likeCount || 0,
          isLiked: !!userLiked,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
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
    const videoId = id;

    const user = await getUserFromApiRequest(request);

    if (!videoId.trim()) {
      throw new Error("VideoId not Provided");
    }

    const deleteVideo = await Video.findById(videoId);

    if (
      !deleteVideo ||
      !(deleteVideo.owner.toString() === user._id.toString())
    ) {
      throw new Error("Video not found");
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId, { new: true });

    if (!deletedVideo) {
      throw new Error("Video deletion failed");
    }

    return NextResponse.json(
      { success: true, message: "Video deleted successfully" },
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
    if(!videoId.trim()){
      throw new Error("VideoId not provided");
    }
    const video = await Video.findById(videoId)
    if(!video){
      throw new Error("Video not found");
    }

    if(video.isPublished){
      video.isPublished=false;
    }else{
      video.isPublished=true;
    }

    const updatedVideo = await video.save();
    return NextResponse.json({success:true,message:"Video publish status toggled successfully",updatedVideo},{status:200})

  } catch (error) {
    console.log(error)
    return NextResponse.json({success:false,message:"Something went wrong"},{status:500})
  }
}
