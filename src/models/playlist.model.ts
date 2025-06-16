import mongoose,{ Schema } from "mongoose";

const playlistSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        videos:[
            {
                types:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }

    },{timestamps:true}
)

export const PlayList = mongoose.models.PlayList || mongoose.model("PlayList",playlistSchema)