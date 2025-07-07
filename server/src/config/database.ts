import mongoose from "mongoose";
import logger from "./logger";

let cachedConnection: mongoose.Connection | null = null;

const connectDB = async (): Promise<mongoose.Connection> => {
  if (cachedConnection) {
    logger.debug("Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const options: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 3000,
      waitQueueTimeoutMS: 5000,
      retryWrites: true,
      retryReads: true,
    };

    await mongoose.connect(mongoURI, options);

    cachedConnection = mongoose.connection;

    logger.info(`MongoDB Connected: ${cachedConnection.host}`);

    cachedConnection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
      cachedConnection = null;
    });

    cachedConnection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
      cachedConnection = null;
    });

    process.on("SIGINT", async () => {
      if (cachedConnection) {
        await cachedConnection.close();
        logger.info("MongoDB connection closed through app termination");
      }
      process.exit(0);
    });

    return cachedConnection;
  } catch (error) {
    logger.error("Database connection failed:", error);
    throw error;
  }
};

export default connectDB;