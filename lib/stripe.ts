import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Create a customer
export async function createStripeCustomer(email: string): Promise<string> {
  try {
    const customer = await stripe.customers.create({
      email,
      metadata: {
        source: 'deposit-defenders'
      }
    });
    
    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error('Failed to create customer');
  }
}

// Create a subscription
export async function createSubscription(
  customerId: string,
  paymentMethodId: string,
  priceId: string
): Promise<Stripe.Subscription> {
  try {
    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new Error('Failed to create subscription');
  }
}

// Create payment intent for one-time payments
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  customerId?: string
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        source: 'deposit-defenders',
        plan: 'pro'
      }
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
}

// Get subscription by customer ID
export async function getSubscriptionByCustomer(customerId: string): Promise<Stripe.Subscription | null> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    return subscriptions.data[0] || null;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

// Pricing configuration
export const PRICING_CONFIG = {
  pro: {
    priceId: 'price_pro_monthly', // Replace with your actual Stripe price ID
    amount: 19, // $19/month
    currency: 'usd',
    interval: 'month'
  }
};