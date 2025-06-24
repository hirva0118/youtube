import { PlayList } from "@/models/playlist.model";
import { getUserFromRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

//get playlist by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  await connectToDatabase();
  const { playlistId } = await params;
  try {
    if (!playlistId) {
      throw new Error("Playlist not Found");
    }

    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
      throw new Error("Playlist not found");
    }

    return NextResponse.json(
      { success: true, message: "playlist fetched successfully", playlist },
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

//delete playlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  await connectToDatabase();
  const { playlistId } = await params;
  try {
    if (!playlistId) {
      throw new Error("Playlist not Found");
    }

    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
      throw new Error("Playlist not found");
    }

    const user = await getUserFromRequest();

    if (!(playlist.owner.toString() === user._id.toString())) {
      throw new Error("User have to login to delete playlist");
    }

    await PlayList.findByIdAndDelete(playlistId);
    return NextResponse.json(
      { success: true, message: "Playlist deleted successfully" },
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
