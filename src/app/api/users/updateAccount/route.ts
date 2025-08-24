import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { getUserFromRequest } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // const token = request.cookies.get("accessToken")?.value;
    // if (!token) {
    //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    // }

    // const decodedToken = jwt.verify(
    //   token,
    //   process.env.ACCESS_TOKEN_SECRET as string
    // ) as { _id: string };
    // const userId = decodedToken._id;

    const userId = await getUserFromRequest();

    const reqBody = await request.json();
    const { fullName, email, username } = reqBody;

    if (!fullName || !email || !username) {
      throw new Error("All Fields are required");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { fullName: fullName, username: username, email: email } },
      { new: true }
    ).select("-password");

    return NextResponse.json({
        success: true,
        message: "Profile updated successfully.",
        user
    });

  } catch (error: unknown) {
  if (error instanceof Error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }

  // Fallback for non-Error types (e.g., strings, numbers)
  console.log(error);
  return NextResponse.json(
    { error: "Something went wrong" },
    { status: 500 }
  );
}

}
