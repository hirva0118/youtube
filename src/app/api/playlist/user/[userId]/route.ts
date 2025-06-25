import mongoose from "mongoose";
import { PlayList } from "@/models/playlist.model";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

//get user playlist
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  await connectToDatabase();
  const { userId } = await params;
  try {
    if (!userId) {
      throw new Error("UserId not provided");
    }

    const playlist = await PlayList.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "videos",
          foreignField: "_id",
          as: "videos",
          pipeline: [
            {
              $project: {
                _id: 1,
                title: 1,
                description: 1,
                videoFile: 1,
                thumbnail: 1,
              },
            },
          ],
        },
      },
    ]);

    if (!playlist) {
      throw new Error("No playlist Found");
    }

    return NextResponse.json(
      { success: true, message: "Playlist fetched successfully", playlist },
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
