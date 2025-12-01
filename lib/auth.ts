import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(
    { 
      ...payload,
      iat: Math.floor(Date.now() / 1000)
    },
    jwtSecret,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    } as jwt.SignOptions
  );
}

export function verifyJWT(token: string): JWTPayload {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.verify(token, jwtSecret) as JWTPayload;
}

export function extractTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export async function authenticateUser(req: NextRequest) {
  const token = extractTokenFromRequest(req);
  
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const payload = verifyJWT(token);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}