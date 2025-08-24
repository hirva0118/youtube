
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/mongodb";
import { getUserFromRequest } from "@/utils/auth";
import { Video } from "@/models/video.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const reqBody = await request.json();
    const { title, description, videoFile, thumbnail, duration } = reqBody;

  
    if (![title, description, videoFile, thumbnail].every((field) => field?.trim() !== "")) {
      throw new Error("Title, description, video, and thumbnail are required");
    }


    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    
    const newVideo = await Video.create({
      title,
      description,
      videoFile,  
      thumbnail,  
      views: 0,
      duration,   
      isPublished: true,
      owner: user._id,
    });

    await newVideo.save();

    return NextResponse.json({
      success: true,
      message: "Video published successfully",
      data: newVideo,
    }, { status: 200 });

  } catch (error: unknown) {
  console.log("Error publishing video:", error);

  const errorMessage =
    error instanceof Error ? error.message : "Something went wrong";

  return NextResponse.json(
    { error: errorMessage },
    { status: 500 }
  );
}

}
