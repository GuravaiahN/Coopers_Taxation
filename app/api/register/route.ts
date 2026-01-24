import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/utils/db';
import User from '@/models/User';

// Simple validators
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password: string): boolean {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

function isValidUSPhone(phone: string): boolean {
  const phoneRegex = /^(\+1)?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phone);
}

export const dynamic = 'force-dynamic';

export const POST = async (request: NextRequest): Promise<Response> => {
  try {
    console.log('Registration request received');
    const { name, email, password, phone } = await request.json();
    console.log('Parsed data:', { name, email, phone });

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
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ message: 'Please enter a valid email address' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
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
    if (!isValidUSPhone(phone)) {
      return new Response(
        JSON.stringify({ message: 'Please enter a valid US phone number' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Connecting to database...');
    // Connect to the database
    await connectToDatabase();
    console.log('Database connected');

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

    console.log('Hashing password...');
    // Hash the user's password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating new user...');
    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Save the new user to the database
    await newUser.save();
    console.log('User saved successfully');
    
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
    console.error('Error stack:', err.stack);
    return new Response(
      JSON.stringify({ 
        message: 'Internal server error',
        error: err.message 
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};