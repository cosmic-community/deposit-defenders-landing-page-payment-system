import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword, createToken, validateEmail, validatePassword } from '@/lib/auth'
import { createUser, findUserByEmail } from '@/lib/cosmic'
import { createStripeCustomer } from '@/lib/stripe'
import { sendWelcomeEmail } from '@/lib/email'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  plan: z.enum(['free', 'pro']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, plan } = signupSchema.parse(body)

    // Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create Stripe customer for Pro plan
    let stripeCustomerId: string | undefined
    if (plan === 'pro') {
      try {
        stripeCustomerId = await createStripeCustomer(email)
      } catch (error) {
        console.error('Failed to create Stripe customer:', error)
        return NextResponse.json(
          { error: 'Failed to set up payment account' },
          { status: 500 }
        )
      }
    }

    // Create user in Cosmic
    const userId = await createUser({
      email,
      hashedPassword,
      plan,
      stripeCustomerId,
    })

    // Create JWT token
    const token = createToken({
      userId,
      email,
      plan,
    })

    // Send welcome email (async, don't wait)
    sendWelcomeEmail(email, plan).catch(error => {
      console.error('Failed to send welcome email:', error)
    })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        email,
        plan,
      },
    })

  } catch (error) {
    console.error('Signup error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}