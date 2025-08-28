'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface FormData {
  email: string
  password: string
  confirmPassword: string
  plan: 'free' | 'pro'
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export default function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planFromUrl = searchParams.get('plan')
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    plan: (planFromUrl === 'pro' ? 'pro' : 'free') as 'free' | 'pro'
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      if (formData.plan === 'pro') {
        // For Pro plan, show payment form
        setShowPayment(true)
        setIsLoading(false)
        return
      }

      // For free plan, create account directly
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          plan: formData.plan
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      // Store token and redirect
      localStorage.setItem('token', data.token)
      router.push('/dashboard')

    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred during signup'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (showPayment) {
    return <PaymentForm email={formData.email} password={formData.password} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Selection */}
      <div>
        <label className="text-base font-medium text-gray-900">
          Choose your plan
        </label>
        <fieldset className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="free"
                name="plan"
                type="radio"
                checked={formData.plan === 'free'}
                onChange={() => setFormData({ ...formData, plan: 'free' })}
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
              />
              <label htmlFor="free" className="ml-3 block">
                <span className="text-sm font-medium text-gray-900">Free Plan</span>
                <span className="text-sm text-gray-500 block">$0/month • Basic features</span>
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="pro"
                name="plan"
                type="radio"
                checked={formData.plan === 'pro'}
                onChange={() => setFormData({ ...formData, plan: 'pro' })}
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
              />
              <label htmlFor="pro" className="ml-3 block">
                <span className="text-sm font-medium text-gray-900">Pro Plan</span>
                <span className="text-sm text-gray-500 block">$19/month • All premium features</span>
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Create a password"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{errors.general}</div>
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : `Create ${formData.plan === 'pro' ? 'Pro' : 'Free'} Account`}
        </button>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <span className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </span>
      </div>
    </form>
  )
}

// Payment Form Component for Pro Plan
function PaymentForm({ email, password }: { email: string; password: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    setIsLoading(true)
    setError('')

    try {
      // First create the account
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          plan: 'pro'
        }),
      })

      const signupData = await signupResponse.json()

      if (!signupResponse.ok) {
        throw new Error(signupData.error || 'Failed to create account')
      }

      // Store token and redirect to dashboard
      localStorage.setItem('token', signupData.token)
      router.push('/dashboard?welcome=true')

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Pro Plan Payment</h3>
        <p className="text-sm text-gray-600 mt-1">
          $19/month • 14-day free trial
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">What you'll get:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Unlimited properties</li>
          <li>• Advanced deposit tracking</li>
          <li>• Automated reminders</li>
          <li>• Legal document templates</li>
          <li>• Priority support</li>
        </ul>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Start 14-Day Free Trial'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        You won't be charged until your free trial ends. Cancel anytime.
      </p>
    </div>
  )
}