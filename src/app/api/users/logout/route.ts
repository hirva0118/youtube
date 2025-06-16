import { cookies } from "next/headers";
import {  NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        (await cookies()).delete("accessToken");
        (await cookies()).delete("refreshToken");
        return NextResponse.json({
            success: true,
            message: "Logged out successfully",
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong while logout user",
        }, { status: 500 });
    }
}

