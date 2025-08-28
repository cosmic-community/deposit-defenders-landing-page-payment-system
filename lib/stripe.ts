import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use compatible API version with current Stripe TypeScript types
})

export async function createPaymentIntent(data: {
  amount: number
  currency: string
  receiptEmail: string
  plan: string
}): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      receipt_email: data.receiptEmail,
      metadata: {
        plan: data.plan,
      },
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

export async function createCustomer(email: string): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email,
    })

    return customer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw new Error('Failed to create customer')
  }
}

export async function createSubscription(data: {
  customerId: string
  priceId: string
  paymentMethodId: string
}): Promise<Stripe.Subscription> {
  try {
    // Attach payment method to customer
    await stripe.paymentMethods.attach(data.paymentMethodId, {
      customer: data.customerId,
    })

    // Update customer's default payment method
    await stripe.customers.update(data.customerId, {
      invoice_settings: {
        default_payment_method: data.paymentMethodId,
      },
    })

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: data.customerId,
      items: [
        {
          price: data.priceId,
        },
      ],
      expand: ['latest_invoice.payment_intent'],
    })

    return subscription
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw new Error('Failed to create subscription')
  }
}

export async function getCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
  try {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    })

    return customers.data[0] || null
  } catch (error) {
    console.error('Error fetching customer:', error)
    return null
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw new Error('Failed to cancel subscription')
  }
}