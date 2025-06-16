import mongoose ,{ Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true, // indexes the field for faster search
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        fullName: {
            type: String,
            trim: true,
            required: true,
            index: true,
        },
        avatar: {
            type: String, //cloudenery url or any other store url
            // required: true,
        },
        coverImage: {
            type: String, //cloudenery url or any other store url
        },
        watchHistory: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Video",
            },
        ],
        password: {
            type: String,
            required: [true, "Why no password?"],
        },
        refreshToken: {
            type: String,
        },
        isVarified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, 
    }
    
)
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password:string){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
    {
            _id: this._id,
            email: this.email,
            userName: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

const User = mongoose.models.User || mongoose.model("User",userSchema)

export default User;