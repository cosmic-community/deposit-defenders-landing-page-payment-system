import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyPassword, createToken } from '@/lib/auth'
import { findUserByEmail } from '@/lib/cosmic'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user by email
    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const storedPassword = user.metadata?.password
    if (!storedPassword) {
      return NextResponse.json(
        { error: 'Account configuration error' },
        { status: 500 }
      )
    }

    const isValidPassword = await verifyPassword(password, storedPassword)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = createToken({
      userId: user.id,
      email: user.metadata.email,
      plan: user.metadata.plan || 'free',
    })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.metadata.email,
        plan: user.metadata.plan || 'free',
        subscriptionStatus: user.metadata.subscription_status || null,
      },
    })

  } catch (error) {
    console.error('Login error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}