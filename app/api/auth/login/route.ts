import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from '@/lib/cosmic'
import { generateToken } from '@/lib/auth'
import type { LoginData, FormErrors } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LoginData
    const { email, password } = body

    // Validation
    const errors: FormErrors = {}
    
    if (!email || !email.includes('@')) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Find user by email
    const user = await findUserByEmail(email)
    
    if (!user) {
      return NextResponse.json(
        { errors: { general: 'Invalid email or password' } },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.metadata?.password || '')
    
    if (!isValidPassword) {
      return NextResponse.json(
        { errors: { general: 'Invalid email or password' } },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.metadata?.email || email,
      plan: user.metadata?.plan || 'free'
    })

    // Create response with token
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.metadata?.email || email,
        plan: user.metadata?.plan || 'free'
      }
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Verify user object exists before accessing metadata
    const userMetadata = user.metadata
    if (!userMetadata) {
      return NextResponse.json(
        { errors: { general: 'User data is incomplete' } },
        { status: 500 }
      )
    }

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { errors: { general: 'An error occurred during login' } },
      { status: 500 }
    )
  }
}