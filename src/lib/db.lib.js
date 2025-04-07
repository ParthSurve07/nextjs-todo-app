import mongoose from "mongoose";
import 'dotenv/config';

export async function connectDB () {
  try {
    if (mongoose.connection.readyState === 1) return;

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected.');
  } catch (error) {
    console.log('Database connection failed.', error.message);
  }
}