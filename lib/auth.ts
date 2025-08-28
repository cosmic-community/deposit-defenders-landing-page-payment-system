import jwt from 'jsonwebtoken'
import type { JWTPayload } from '@/types'

// Ensure JWT_SECRET exists or provide fallback
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined')
  }
  return secret
}

// Generate JWT token
export function generateToken(payload: {
  userId: string
  email: string
  plan: string
}): string {
  const secret = getJWTSecret()
  
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      plan: payload.plan
    },
    secret,
    {
      expiresIn: '7d',
      issuer: 'deposit-defenders',
      audience: 'deposit-defenders-users'
    }
  )
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = getJWTSecret()
    
    const decoded = jwt.verify(token, secret, {
      issuer: 'deposit-defenders',
      audience: 'deposit-defenders-users'
    })
    
    // Type guard to ensure decoded token has required properties
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded &&
      'email' in decoded &&
      'plan' in decoded &&
      'iat' in decoded &&
      'exp' in decoded
    ) {
      return decoded as JWTPayload
    }
    
    return null
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Get user from token
export function getUserFromToken(token: string) {
  const payload = verifyToken(token)
  
  if (!payload) {
    return null
  }

  return {
    userId: payload.userId,
    email: payload.email,
    plan: payload.plan
  }
}

// Middleware helper for protected routes
export function requireAuth(token?: string) {
  if (!token) {
    return null
  }

  return getUserFromToken(token)
}