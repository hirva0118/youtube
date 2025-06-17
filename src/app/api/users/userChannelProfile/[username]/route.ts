import User from "@/models/user.model";
import { getUserFromRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectToDatabase();
    const {username} = await params;
    
    // const username = await params.username;
    if (!username?.trim()) {
      return NextResponse.json(
        { error: "Username is required!" },
        { status: 400 }
      );
    }

    const loggedInUser = await getUserFromRequest();
    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const channel = await User.aggregate([
      {
        $match: {
          username: username?.toLowerCase(),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribed",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
          },
          subscribeToCount: {
            $size: "$subscribed",
          },
          isSubscribed: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$subscribers",
                        as: "subscriber",
                        cond: {
                          $eq: ["$$subscriber.subscriber", loggedInUser._id],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          username: 1,
          fullName: 1,
          email: 1,
          avatar: 1,
          coverImage: 1,
          subscribersCount: 1,
          subscribeToCount: 1,
          isSubscribed: 1,
        },
      },
    ]);

    if (!channel?.length) {
      throw new Error("channel does not exist");
    }

    return NextResponse.json(
      {
        success: true,
        message: "User channel fetched successfully",
        data: channel[0],
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
