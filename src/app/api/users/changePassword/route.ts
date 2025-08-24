import User from "@/models/user.model";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/auth";

export async function POST(request: NextRequest) {
try {
    await connectToDatabase();

    // const token = request.cookies.get("accessToken")?.value;
    // if (!token) {
    //     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    // }

    // const decodedToken = jwt.verify(
    //     token,
    //     process.env.ACCESS_TOKEN_SECRET as string
    // ) as { _id: string };
    // const userId = decodedToken._id;

    const userId = await getUserFromRequest();

    const reqBody = await request.json();
    const { oldPassword, newPassword } = reqBody;

    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        return NextResponse.json(
        { error: "Old password is incorrect" },
        { status: 401 }
    );
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return NextResponse.json({
        success: true,
        message: "Your current password has been changed successfully.",
    });
} catch (error: unknown) {
  let errorMessage = "Something went wrong";

  if (error instanceof Error) {
    errorMessage = error.message;
    console.log(error.stack); // Optional: log stack for debugging
  } else {
    console.log("Unexpected error:", error);
  }

  return NextResponse.json(
    { error: errorMessage },
    { status: 500 }
  );
}

}
