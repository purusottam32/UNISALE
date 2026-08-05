import mongoose from "mongoose";
import config from "./index.js";

mongoose.set("strictQuery", true);

/**
 * Connects to MongoDB. Callers should treat a rejection as fatal — the API
 * cannot serve meaningful traffic without the database.
 */
const connectDB = async () => {
  if (!config.db.uri) {
    throw new Error("MONGO_URI is not set. Copy backend/.env.example to backend/.env.");
  }

  const connection = await mongoose.connect(config.db.uri, {
    serverSelectionTimeoutMS: 10_000,
  });

  console.log(`[db] connected to ${connection.connection.host}/${connection.connection.name}`);

  mongoose.connection.on("error", (error) => {
    console.error("[db] connection error:", error.message);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[db] disconnected");
  });

  return connection;
};

export default connectDB;
