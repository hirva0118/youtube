import { Video } from "@/models/video.model";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const query = searchParams.get("query");
  const sortBy = searchParams.get("sortBy");
  const sortType = searchParams.get("sortType") === "desc" ? -1 : 1;

  const pipeline: any[] = [];
  try {

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        },
      });
    }


    if (sortBy) {
      pipeline.push({
        $sort: {
          [sortBy]: sortType,
        },
      });
    }

    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const videos = await Video.aggregate(pipeline);

    return NextResponse.json(
      {
        success: true,
        message: "Videos fetched successfully",
        data: videos,
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
