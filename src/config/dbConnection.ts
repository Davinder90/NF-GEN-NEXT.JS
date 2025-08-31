import mongoose from "mongoose";
import logger from "@log/logger";
import { env_var } from "./env.config";

export const dbConnection = async () => {
  try {
    await mongoose.connect(env_var.DATABASE_KEY as string);
    logger.info("Database is connected successfully");
  } catch (err) {
    logger.error(`Database is not connected ${err}`);
  }
};
