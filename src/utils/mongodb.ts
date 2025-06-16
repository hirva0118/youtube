import mongoose from "mongoose";
const uri = process.env.MONGODB_URI!;
    
if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let chached = global.mongoose;

if (!chached) {
  chached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (chached.conn) {
    return chached.conn;
  }
  if (!chached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    chached.promise = await mongoose
      .connect(uri, opts)
      .then((mongoose:any) => mongoose.connection);
  }

  try {
    chached.conn = await chached.promise
    console.log("connected")
  } catch (error:any) {
    chached.promise =null
    throw new error
  }

  return chached.conn
}
