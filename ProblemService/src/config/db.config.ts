import mongoose from "mongoose";
import logger from "./logger.config";
import { serverConfig } from ".";

export const connectToDatabase = async () => {
  try {
    const dbUrl = serverConfig.DB_URL;
    await mongoose.connect(dbUrl);
    logger.info(`Connected to the database at ${dbUrl}`);
    mongoose.connection.on("error", (err) => {
      logger.error(`Database connection error: ${err}`);
    });
    mongoose.connection.on("disconnected", () => {
      logger.warn("Database connection lost. Attempting to reconnect...");
      connectToDatabase();
    });
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("Database connection closed due to application termination");
      process.exit(0);
    });
  } catch (error) {
    logger.error(`Error connecting to the database: ${error}`);
    process.exit(1);
  }
};
