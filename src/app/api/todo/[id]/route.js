import { connectDB } from "@/lib/db.lib.js";
import { getTokenFromRequest } from "@/lib/auth.helper.js";
import Todo from '@/models/todo.model.js';
import jwt from 'jsonwebtoken';

export async function PUT (req, { params }) {
  await connectDB();
  const token = getTokenFromRequest(req);
  if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), {
    status: 401
  });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { id } = params;

  const body = await req.json();
  const { title, completed } = body;

  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (completed !== undefined) updateFields.completed = completed;

  const updateTodo = await Todo.findOneAndUpdate(
    { _id: id, userId: decoded.id },
    { $set: updateFields },
    { new: true }
  );

  if (!updateTodo) return new Response(JSON.stringify({ message: 'Todo not found' }), {
    status: 404
  });

  return new Response(JSON.stringify({ message: 'Todo updated', todo: updateTodo }), {
    status: 200
  });
}

export async function DELETE (req, { params }) {
  await connectDB();
  const token = getTokenFromRequest(req);
  if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), {
    status: 401
  });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { id } = params;

  const deleted = await Todo.findOneAndDelete({
    _id: id,
    userId: decoded.id
  });

  if (!deleted) {
    return new Response(JSON.stringify({ message: 'Todo not found or not yours' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ message: 'Todo deleted' }), {
    status: 200
  });
}