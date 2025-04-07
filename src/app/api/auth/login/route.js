import { connectDB } from '@/lib/db.lib.js';
import User from '@/models/user.model.js';
import bcrypt from 'bcryptjs';  
import jwt from 'jsonwebtoken';

export async function POST (req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
        status: 401
      });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
        status: 401
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return new Response(JSON.stringify({ message: 'Login successful', token }), {
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error logging in' }), {
      status: 500
    });
  }
}
