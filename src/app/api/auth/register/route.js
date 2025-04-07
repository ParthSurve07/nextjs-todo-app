import { connectDB } from "@/lib/db.lib.js";
import User from "@/models/user.model.js";
import bcrypt from "bcryptjs";

export async function POST (req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();

    return new Response(JSON.stringify({ message: "User registered successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ message: "Error registering user" }), {
      status: 500,
    });
  }
}