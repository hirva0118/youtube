import { cookies } from "next/headers"
import jwt from 'jsonwebtoken'
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export const getUserFromRequest = async() => {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("accessToken")?.value
        if(!token){
            return new Error("Not authenticated")
        }
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
            ) as { _id: string };
            const user = await User.findById(decodedToken._id).select("-password -refreshToken");
            if (!user) throw new Error("User not found");

            return user;

    } catch (error: unknown) {
  if (error instanceof Error) {
    throw new Error(error.message || "Unauthorized");
  } else {
    throw new Error("Unauthorized");
  }
}

}

export const getUserFromApiRequest = async(request: NextRequest) => {
    try {
        // Get token from cookies in the request
        const token = request.cookies.get("accessToken")?.value;
        
        if(!token){
            throw new Error("Not authenticated - No token provided");
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as { _id: string };

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        
        if (!user) {
            throw new Error("User not found");
        }

        return user;

    } catch (error: unknown) {
  if (error instanceof Error) {
    throw new Error(error.message || "Unauthorized");
  } else {
    throw new Error("Unauthorized");
  }
}

}