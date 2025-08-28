import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail } from '@/lib/cosmic'
import { generateToken } from '@/lib/auth'
import type { SignupData, FormErrors } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SignupData
    const { email, password, plan } = body

    // Validation
    const errors: FormErrors = {}
    
    if (!email || !email.includes('@')) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    if (!plan || !['free', 'pro'].includes(plan)) {
      errors.general = 'Please select a valid plan'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    
    if (existingUser) {
      return NextResponse.json(
        { errors: { email: 'An account with this email already exists' } },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in Cosmic
    const userId = await createUser({
      email,
      hashedPassword,
      plan
    })

    // Generate JWT token
    const token = generateToken({
      userId,
      email,
      plan
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        plan
      }
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // For pro plan, we would handle Stripe subscription here
    if (plan === 'pro') {
      // TODO: Integrate with Stripe for subscription creation
      // This would be handled in a separate payment flow
    }

    // Verify response exists before accessing metadata
    if (!response) {
      return NextResponse.json(
        { errors: { general: 'Failed to create response' } },
        { status: 500 }
      )
    }

    return response

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { errors: { general: 'An error occurred during signup' } },
      { status: 500 }
    )
  }
}