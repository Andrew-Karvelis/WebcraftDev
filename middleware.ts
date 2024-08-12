// middleware.ts
import { NextResponse } from 'next/server';
import { verifyIdToken } from './src/lib/firebaseAdmin'; // Adjust import based on your setup
import { cookies } from 'next/headers';

export async function middleware(req: Request) {
  const cookieStore = cookies(); // Get cookies from the request
  const token = cookieStore.get('auth-token'); // Replace 'auth-token' with your cookie name

  // Ensure token is a string
  if (typeof token === 'string') {
    try {
      // Verify the token
      await verifyIdToken(token);
      return NextResponse.next(); // Allow the request to proceed
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.redirect('/login'); // Redirect to login if token is invalid
    }
  } else {
    return NextResponse.redirect('/login'); // Redirect to login if no token is found
  }
}

export const config = {
  matcher: '/protected/*', // Adjust to match the routes you want to protect
};
