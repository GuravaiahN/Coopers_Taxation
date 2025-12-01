import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()
    
    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // In production, save to database and send email
    const contactSubmission = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      subject,
      message,
      submittedAt: new Date().toISOString(),
      status: 'new'
    }

    console.log('Contact submission:', contactSubmission)

    // Here you would typically:
    // 1. Save to database
    // 2. Send notification email to admin
    // 3. Send confirmation email to user

    return NextResponse.json({
      message: 'Contact form submitted successfully. We will get back to you soon!',
      id: contactSubmission.id
    }, { status: 201 })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Contact endpoint - use POST to submit form' })
}