import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail } from '@/lib/cosmic'
import { generateToken } from '@/lib/auth'
import type { SignupData, FormErrors } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SignupData
    const { email, password, plan } = body

    // Validation with proper type safety
    const errors: FormErrors = {}
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!password || typeof password !== 'string' || password.length < 6) {
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

    // Hash password with proper error handling
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (hashError) {
      console.error('Password hashing failed:', hashError);
      return NextResponse.json(
        { errors: { general: 'Failed to process password' } },
        { status: 500 }
      );
    }

    // Create user in Cosmic
    let userId: string;
    try {
      userId = await createUser({
        email,
        hashedPassword,
        plan
      });
    } catch (createError) {
      console.error('User creation failed:', createError);
      return NextResponse.json(
        { errors: { general: 'Failed to create user account' } },
        { status: 500 }
      );
    }

    // Generate JWT token with proper error handling
    let token: string;
    try {
      token = generateToken({
        userId,
        email,
        plan
      });
    } catch (tokenError) {
      console.error('Token generation failed:', tokenError);
      return NextResponse.json(
        { errors: { general: 'Failed to generate authentication token' } },
        { status: 500 }
      );
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      token, // Include token in response for client-side storage
      user: {
        id: userId,
        email,
        plan
      }
    })

    // Set HTTP-only cookie with proper configuration
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    // For pro plan, we would handle Stripe subscription here
    if (plan === 'pro') {
      // TODO: Integrate with Stripe for subscription creation
      // This would be handled in a separate payment flow
      console.log('Pro plan signup - Stripe integration needed');
    }

    return response

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { errors: { general: 'An unexpected error occurred during signup' } },
      { status: 500 }
    )
  }
}