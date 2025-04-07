import { connectDB } from "@/lib/db.lib.js";
import { getTokenFromRequest } from "@/lib/auth.helper.js";
import Todo from '@/models/todo.model.js';
import jwt from 'jsonwebtoken';

export async function POST (req) {
  await connectDB();

  const token = getTokenFromRequest(req);
  if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), {
    status: 401
  });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const body = await req.json();
  const { title } = body;

  const newTodo = new Todo({
    title,
    userId: decoded.id
  });

  await newTodo.save();

  return new Response(JSON.stringify({
      message: 'Todo created',
      todo: newTodo
    }),
    { status: 201 }
  );
}

export async function GET (req) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const todos = await Todo.find({ userId: decoded.id });

    return new Response(JSON.stringify({ todos }), {
      status: 200,
    });
  } catch (error) {
    console.error("GET Todos Error:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch todos" }), {
      status: 500,
    });
  }
  // await connectDB();

  // const token = getTokenFromRequest(req);
  // if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), {
  //   status: 401
  // });

  // const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // const todos = await Todo
  //   .find({
  //     userId: decoded.id
  //   })
  //   .sort({
  //     createdAt: -1
  //   });

  // return new Response(JSON.stringify(todos), {
  //   status: 200
  // });
}