import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { connectToDatabase } from '@/utils/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export const POST = async (request: NextRequest): Promise<Response> => {
  const { name, email, password, phone } = await request.json();

  // Validate that all fields are present
  if (!name || !email || !password || !phone) {
    return new Response(
      JSON.stringify({
        message: 'All fields (name, email, password, phone) are required',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return new Response(
      JSON.stringify({ message: 'Please enter a valid email address' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Validate password strength
  if (!validator.isStrongPassword(password, { minLength: 8 })) {
    return new Response(
      JSON.stringify({
        message:
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Regular expression for validating US phone numbers
  const phoneRegex = /^(\+1)?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  if (!phoneRegex.test(phone)) {
    return new Response(
      JSON.stringify({ message: 'Please enter a valid US phone number' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Connect to the database
  await connectToDatabase();

  // Check if a user with the provided email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(
      JSON.stringify({ message: 'Email is already in use' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Hash the user's password with 10 salt rounds
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    phone,
  });

  try {
    // Save the new user to the database
    await newUser.save();
    return new Response(
      JSON.stringify({ message: 'User registered successfully' }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    // Handle any errors that occur during the save process
    console.error('Error registering user:', err);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};