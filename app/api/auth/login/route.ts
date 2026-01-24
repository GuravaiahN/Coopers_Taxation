import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateJWT } from '../../../../lib/auth'
import { connectToDatabase } from '../../../../utils/db'
import User from '../../../../models/User'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role.toUpperCase()
    })

    // Return user data (without password)
    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    }

    return NextResponse.json({
      user: userData,
      token,
      message: 'Login successful'
    }, { status: 200 })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Login endpoint - use POST method',
    demo_accounts: [
      { email: 'admin@coopers.com', password: 'admin123', role: 'admin' },
      { email: 'user@coopers.com', password: 'user123', role: 'user' },
      { email: 'test@cooperstaxation.com', password: 'test123', role: 'user' }
    ]
  })
}