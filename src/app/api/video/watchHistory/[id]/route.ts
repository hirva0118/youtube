import User from "@/models/user.model";
import { Video } from "@/models/video.model";
import { getUserFromRequest } from "@/utils/auth";
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
      throw new Error("videoId not provided");
    }

    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("video not provided");
    }

    const loggedUser = await getUserFromRequest();

    const user = await User.findById(loggedUser._id);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.watchHistory.includes(videoId)) {
      return NextResponse.json(
        { success: true, message: "Video already in watch history" },
        { status: 200 }
      );
    }

    user.watchHistory.push(video);
    const updatedUser = await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Video successfully added to watch history",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error:any) {
    console.log(error)
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
