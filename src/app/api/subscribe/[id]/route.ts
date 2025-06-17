import Subscription from "@/models/subscription.model";
import { getUserFromRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  const { id } = await params;
  const channelId = id;

  try {
    if (!channelId) {
      throw new Error("channelId not provided");
    }
    const user = await getUserFromRequest();
    if (!user) {
      throw new Error("user not authenticated");
    }

    const alreadySubscribed = await Subscription.find({
      channel: channelId,
      subscriber: user._id,
    });

    if (alreadySubscribed && alreadySubscribed.length > 0) {
      await Subscription.findOneAndDelete(alreadySubscribed, { new: true });

      return NextResponse.json(
        { success: true, message: "Unsubscribed successfully" },
        { status: 200 }
      );
    }

    const subscription = await Subscription.create({
      channel: channelId,
      subscriber: user._id,
    });

    if (!subscription) {
      throw new Error("Unable to subscribe");
    }

    return NextResponse.json(
      { success: true, message: "Subscribed successfully", subscription },
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

//return subscriber list of a channel
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const channelId = id;
  try {
    if (!channelId) {
      throw new Error("Please provide channelId");
    }
    const channel = await User.findById({ _id: channelId });
        if (!channel) {
            throw new Error("channel not found");
        }
        const subscribers = await Subscription.find({
            channel: channelId,
        });

    return NextResponse.json(
      { success: true, message: "Subscribers", subscribers },
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
