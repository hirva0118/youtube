import User from "@/models/user.model";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const reqBody = await request.json();
    const { fullName, email, username, password,avatar,coverImage } = reqBody;
    console.log(reqBody)

    if (
      [fullName, email, username, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new Error("Every details is required");
    }
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      throw new Error("User already exists");
    }

    const user = await User.create({
      fullName,
      username,
      email,
      password,
      avatar,
      coverImage
    });
    await user.save();

    const data = await User.findById(user._id).select("-password")

    if(!data){
        throw new Error("Server error")
    }

    return NextResponse.json({message:"User Registered successfully", success: true, data }, { status: 200 });

  } catch (error) {

    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
