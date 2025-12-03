// app/api/contact/route.ts

import { NextRequest } from 'next/server';
import validator from 'validator';
import Contact from '@/models/Contact';
import { connectToDatabase } from '@/utils/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<Response> {
  await connectToDatabase();

  try {
    const { name, email, phone, message } = await req.json();

    // Validate inputs
    if (!name || !email || !phone || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'All fields are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!validator.isEmail(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid email address',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Additional validation for phone number if needed

    const newContact = new Contact({
      name,
      email,
      phone,
      message,
    });

    await newContact.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message received!',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error saving contact form:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}