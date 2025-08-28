import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
})

// Price IDs for different plans
export const PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_1234567890abcdef',
} as const

// Create payment intent for one-time payments
export async function createPaymentIntent(params: {
  amount: number
  currency: string
  customerEmail: string
  metadata?: Record<string, string>
}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      customer_email: params.customerEmail,
      metadata: params.metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw new Error('Failed to create payment intent')
  }
}

// Create customer
export async function createCustomer(params: {
  email: string
  name?: string
  metadata?: Record<string, string>
}) {
  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata || {},
    })

    return customer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw new Error('Failed to create customer')
  }
}

// Create subscription
export async function createSubscription(params: {
  customerId: string
  priceId: string
  paymentMethodId: string
}) {
  try {
    // Attach payment method to customer
    await stripe.paymentMethods.attach(params.paymentMethodId, {
      customer: params.customerId,
    })

    // Set as default payment method
    await stripe.customers.update(params.customerId, {
      invoice_settings: {
        default_payment_method: params.paymentMethodId,
      },
    })

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: params.customerId,
      items: [{ price: params.priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })

    return subscription
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw new Error('Failed to create subscription')
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw new Error('Failed to cancel subscription')
  }
}

// Get customer by email
export async function getCustomerByEmail(email: string) {
  try {
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    return customers.data[0] || null
  } catch (error) {
    console.error('Error fetching customer:', error)
    throw new Error('Failed to fetch customer')
  }
}

// Webhook signature verification
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    throw new Error('Invalid webhook signature')
  }
}