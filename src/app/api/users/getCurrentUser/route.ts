import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/auth";

export async function GET() {
    try {
        await connectToDatabase();

        // const token = request.cookies.get("accessToken")?.value
        // if (!token) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        // const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!) as {_id:string}
        // if (!decodedToken || !decodedToken._id) {
        //     return NextResponse.json({ error: "Invalid token" }, { status: 403 });
        // }

        // const user = await User.findById(decodedToken._id).select("-password -refreshToken")

        const user = await getUserFromRequest();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, user }, { status: 200 });

    } catch (error: unknown) {
  let errorMessage = "Something went wrong";

  if (error instanceof Error) {
    console.log("getCurrentUser Error:", error.message);
    errorMessage = error.message;
  } else {
    console.log("getCurrentUser Error (unexpected type):", error);
  }

  return NextResponse.json(
    { error: errorMessage },
    { status: 500 }
  );
}

}