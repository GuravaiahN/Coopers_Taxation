// app/utils/adminCheck.ts
import { getSession } from 'next-auth/react';
import User from '@/models/User';
import { connectToDatabase } from './db';

export async function isAdmin(request: any) {
  await connectToDatabase();

  const session = await getSession({
    req: { headers: { cookie: request.headers.get('cookie') || '' } },
  });

  if (!session?.user?.email) return false;

  const user = await User.findOne({ email: session.user.email });
  return user?.isAdmin || false;
}
