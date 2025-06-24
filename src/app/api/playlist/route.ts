import { PlayList } from "@/models/playlist.model";
import { getUserFromRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";


//create playlist
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const reqBody = await request.json();
    const { name, description } = reqBody;

    if (!name && !description) {
      throw new Error("Please provide name and description");
    }

    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    const playlist = await PlayList.create({
      name,
      description,
      owner: user._id,
    });

    return NextResponse.json(
      { success: true, message: "Playlist created successfully", playlist },
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
