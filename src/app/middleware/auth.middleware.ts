
// import User from "@/models/user.model";
// import jwt from "jsonwebtoken";

// export const varifyJwt = (async (req:any, _, next:any) => {
//     try {
//         const token =
//             req.cookies?.accessToken ||
//             req.header("Authorization")?.replace("Bearer ", "");

//         if (!token) {
//             throw new Error("Not authenticated!");
//         }

//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)  ;

//         const user = await User.findById(decodedToken?._id).select(
//             "-password -refreshToken"
//         );

//         if (!user) {
//             throw new Error( "Invalid Access token!");
//         }
//         req.user = user;
//         next();
//     } catch (error:any) {
//         throw new Error( error?.message || "Unauthorized");
//     }
// });
