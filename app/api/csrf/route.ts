/**
 * CSRF Token API Endpoint
 *
 * GET /api/csrf - Returns a new CSRF token for the client
 * SECURITY FIX: Sets httpOnly cookie with signed token
 */

import { NextResponse } from 'next/server';
import { generateCSRFToken } from '@/lib/csrf';

export async function GET() {
  try {
    // Generate token and cookie
    const { token, cookie } = generateCSRFToken();

    // Return token in JSON body for client to use in headers
    // Cookie is set automatically for validation
    return NextResponse.json(
      { token },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Set-Cookie': cookie, // Set httpOnly cookie with signed token
        },
      }
    );
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
