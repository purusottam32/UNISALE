import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  const connection = await mongoose.connect(mongoURI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

export default connectDB;
