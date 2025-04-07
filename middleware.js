import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware (req) {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token' }, {
      status: 401
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized: No token' }, {
      status: 401
    });
  }
}

export const config = {
  matcher: [
    '/api/todo/:path'
  ]
}