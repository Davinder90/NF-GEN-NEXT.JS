import mongoose from "mongoose";
import logger from "@log/logger";
import { env_var } from "./env.config";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

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
      .connect(env_var.DATABASE_KEY as string, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000, // fail fast if cannot connect
      })
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        // Reset promise so next attempt can retry
        globalCache.mongoose!.promise = null;
        throw err;
      });
  }

  try {
    globalCache.mongoose!.conn = await globalCache.mongoose!.promise;
    logger.info("✅ Database is connected successfully");
    return globalCache.mongoose!.conn;
  } catch (err) {
    logger.error("❌ Database connection failed", err);
    throw err;
  }
};
