import User from "@/models/user.model";
import { connectToDatabase } from "@/utils/mongodb";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Token generation error:", error.message);
  } else {
    console.error("Token generation error:", error);
  }

  throw new Error("Failed to generate tokens");
}

};

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const reqBody = await request.json();
    const { email, password } = reqBody;
    if (!email) {
      return NextResponse.json(
        { error: "Please enter email" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User does not exist");
    }

    // console.log("Password entered:", password);
    // console.log("Hashed Password from DB:", user.password);

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    (await cookies()).set("accessToken", accessToken, {
      httpOnly: true,
      // secure: true,
      secure: process.env.NODE_ENV === "production"
    });
    (await cookies()).set("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: true,
      secure: process.env.NODE_ENV === "production"
    });

    return NextResponse.json(
      {
        success: true,
        message: "User logged in successfuly",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong during login",
      },
      { status: 500 }
    );
  }
}
