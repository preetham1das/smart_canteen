import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, mongod: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    let uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smart_canteen";

    // Use memory server ONLY if explicitly requested or as a last resort
    if (uri === "memory") {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      if (!cached.mongod) {
        cached.mongod = await MongoMemoryServer.create();
      }
      uri = cached.mongod.getUri();
      console.log("🚀 Using in-memory MongoDB at:", uri);
    }

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log("✅ MongoDB connected to:", uri);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
