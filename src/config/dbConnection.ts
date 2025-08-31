import mongoose from "mongoose";
import logger from "@log/logger";
import { env_var } from "./env.config";

// Define a proper type for cached connections
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use globalThis to persist connection across Lambda invocations
const globalCache = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

if (!globalCache.mongoose) {
  globalCache.mongoose = { conn: null, promise: null };
}

export const dbConnection = async (): Promise<typeof mongoose> => {
  if (globalCache.mongoose!.conn) {
    return globalCache.mongoose!.conn;
  }

  if (!globalCache.mongoose!.promise) {
    globalCache.mongoose!.promise = mongoose
      .connect(env_var.DATABASE_KEY as string)
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    globalCache.mongoose!.conn = await globalCache.mongoose!.promise;
    logger.info("Database is connected successfully");
    return globalCache.mongoose!.conn;
  } catch (err) {
    logger.error(`Database is not connected: ${err}`);
    throw err;
  }
};
