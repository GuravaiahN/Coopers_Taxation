// utils/authOptions.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectToDatabase } from '@/utils/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // 1. Connect to database
          await connectToDatabase(); // Ensure database connection

          // 2. Validate credentials
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Credentials are required');
          }

          // 3. Find user by email
          const user = await User.findOne({ email: credentials.email }).lean();
          if (!user) {
            throw new Error('User not found, please register first');
          }

          // 4. Compare password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          // 5. Return user details with role and isAdmin status
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            image: user.image || null,
            isAdmin: user.isAdmin || false,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        // Ensure database connection
        await connectToDatabase();

        // Pass token data to session
        if (token) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
          session.user.role = token.role as 'user' | 'admin';
          session.user.phone = token.phone as string;
          session.user.image = (token.image as string) || null;
          session.user.isAdmin = token.isAdmin as boolean;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        throw error;
      }
    },
    async jwt({ token, user }) {
      try {
        // Ensure database connection
        await connectToDatabase();

        if (user) {
          // Assign JWT values when user is provided (during login)
          token.id = user.id;
          token.name = user.name;
          token.role = user.role === 'admin' ? 'admin' : 'user';
          token.phone = user.phone;
          token.image = user.image || null;
          token.isAdmin = user.isAdmin || false;
        } else if (token.id) {
          // Retrieve user data from DB if token exists
          const dbUser = await User.findById(token.id).lean();
          if (dbUser) {
            token.name = dbUser.name;
            token.phone = dbUser.phone;
            token.image = dbUser.image || null;
            token.isAdmin = dbUser.isAdmin || false;
          }
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        throw error;
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/page-not-found',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
