// utils/sessionAuth.ts
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isAdmin: boolean;
  phone?: string;
}

export async function getServerSession(request: NextRequest): Promise<SessionUser | null> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.id) {
      return null;
    }

    return {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string,
      role: token.role as 'user' | 'admin',
      isAdmin: token.isAdmin as boolean,
      phone: token.phone as string,
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<SessionUser> {
  const session = await getServerSession(request);
  if (!session) {
    throw new Error('Unauthorized - Please login');
  }
  return session;
}

export async function requireAdmin(request: NextRequest): Promise<SessionUser> {
  const session = await requireAuth(request);
  if (session.role !== 'admin' && !session.isAdmin) {
    throw new Error('Forbidden - Admin access required');
  }
  return session;
}