import { v2 } from 'cloudinary'

console.log("Cloud name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});


// const uploadOnCloudinary = async(localFilePath:any) =>{
//     try {
//         if(!localFilePath) return null;
//         const response = await v2.uploader.upload(localFilePath,{
//             resource_type:"auto"
//         })
//         console.log("File uploaded",response.url)
//         return response.data;
//     } catch (error) {
//         console.log(error)
//         fs.unlinkSync(localFilePath)  //Remove file from local server
//         return null;
//     }
// }

// export default uploadOnCloudinary;


export async function POST(request: Request) {

  const body = await request.json();
  const { paramsToSign } = body;
  try {
    const signature = v2.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );
    return new Response(JSON.stringify({ signature }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error signing request:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}