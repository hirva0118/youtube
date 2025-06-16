import User from "@/models/user.model";
import { Video } from "@/models/video.model";
import { getUserFromApiRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongodb";
import { isValidObjectId, Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    try {
        await connectToDatabase();

        const user = await getUserFromApiRequest(request);
        const userId = user._id
        const {searchParams} = request.nextUrl;
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const query = searchParams.get("query")
        const sortBy = searchParams.get("sortBy")
        const sortType = searchParams.get("sortType") === "desc"? -1 : 1
        // const userId = searchParams.get("userId")

        const pipeline: any[] = []

        if(userId){
            if(!isValidObjectId(userId)){
                return NextResponse.json({error:"Invalid UserId provided"},{status:400})
            }
        }

        const userExists = await User.findById(userId)
        if(!userExists){
            return NextResponse.json({error:"User does not exists"},{status:400})
        }

        if(userId){
            pipeline.push({
                $match:{
                    owner : new Types.ObjectId(userId)
                },
            })
        }
        if(query){
            pipeline.push({
                $match:{
                    $or:[
                        {title: { $regex: query, $options: "i" }},
                        {description: { $regex: query, $options: "i" }}
                    ]
                }
            })
        }

        if(sortBy){
            pipeline.push({
                $sort:{
                    [sortBy] : sortType
                }
            })
        }

        const skip = (page - 1) * limit;
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        const videos = await Video.aggregate(pipeline)

        return NextResponse.json( 
        {
            success: true,
            message: "Videos fetched successfully",
            data: videos,
        },
        { status: 200 })


    } catch (error:any) {
        console.error("Get Videos Error:", error);
        return NextResponse.json(
        { error: error.message || "Something went wrong" },
        { status: 500 }
        );
    }
}