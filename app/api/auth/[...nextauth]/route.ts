import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';