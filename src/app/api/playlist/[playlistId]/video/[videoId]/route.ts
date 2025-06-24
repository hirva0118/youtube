import { PlayList } from "@/models/playlist.model";
import { Video } from "@/models/video.model";
import { getUserFromRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

//add video to playlist
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string; playlistId: string }> }
) {
  await connectToDatabase();
  const {  videoId,  playlistId } =await params;
  const VideoId = videoId;
  const PlaylistId = playlistId;

  try {
    if (!VideoId) {
      throw new Error("Please provide videoId");
    }
    if (!PlaylistId) {
      throw new Error("Please provide playlistId");
    }

    const playlist = await PlayList.findById(PlaylistId);
    if (!playlist) {
      throw new Error("Playlist not found");
    }

    const user = await getUserFromRequest();

    if (!(playlist.owner.toString() === user._id.toString())) {
      throw new Error("User has to login to add video to playlist");
    }

    const isVideoInPlayList = await playlist.videos.includes(VideoId);
    if (isVideoInPlayList) {
      throw new Error("Video already in playlist");
    }

    const video = await Video.findById(VideoId);
    if (!video) {
      throw new Error("Video not found");
    }
    playlist.videos.push(video);
    await playlist.save();
    return NextResponse.json(
      {
        success: true,
        message: "Video addedd to playlist successfully",
        playlist,
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

// remove video from playlist
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string; playlistId: string }> }
) {
  await connectToDatabase();
  const { videoId: videoId, playlistId: playlistId } = await params;
  try {
    if (!videoId) {
      throw new Error("Please provide videoId");
    }
    if (!playlistId) {
      throw new Error("Please provide playlistId");
    }
    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
      throw new Error("Playlist not found");
    }

    const user = await getUserFromRequest();

    if (!(playlist.owner.toString() === user._id.toString())) {
      throw new Error("User has to login to add video to playlist");
    }

    const isVideoInPlaylist = await playlist.videos.includes(videoId);
    if (!isVideoInPlaylist) {
      throw new Error("Video not in Playlist");
    }

    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not Found");
    }

    playlist.videos.pull(video);
    await playlist.save();

    return NextResponse.json(
      {
        success: true,
        message: "video removed from playlist successfully",
        playlist,
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
