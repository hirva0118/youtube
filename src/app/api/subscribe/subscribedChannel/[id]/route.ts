import Subscription from "@/models/subscription.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

//return channel list to which user has subscribed
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const subscriberId = id;
  try {
    if (!subscriberId) {
      throw new Error("Please provide subscribe ID");
    }
    const subscriber = await User.findById({ _id: subscriberId });

    if (!subscriber) {
      throw new Error("subscriber not found");
    }

    const subscribedChannel = await Subscription.find({
      subscriber: subscriberId,
    });

    return NextResponse.json(
      { success: true, message: "Subscribed channels", subscribedChannel },
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
