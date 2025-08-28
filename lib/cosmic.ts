import { createBucketClient } from '@cosmicjs/sdk'
import type { LandingPage, PricingTier, CosmicResponse } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch landing page content
export async function getLandingPage(): Promise<LandingPage | null> {
  try {
    const response = await cosmic.objects
      .find({ type: 'landing-pages' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const landingPage = response.objects[0] as LandingPage;
    
    if (!landingPage) {
      return null;
    }
    
    return landingPage;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch landing page content');
  }
}

// Fetch pricing tiers
export async function getPricingTiers(): Promise<PricingTier[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'pricing-tiers' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const tiers = response.objects as PricingTier[];
    
    // Sort by display_order
    return tiers.sort((a, b) => {
      const orderA = a.metadata?.display_order || 0;
      const orderB = b.metadata?.display_order || 0;
      return orderA - orderB;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch pricing tiers');
  }
}

// Create user record in Cosmic
export async function createUser(userData: {
  email: string;
  hashedPassword: string;
  plan: string;
  stripeCustomerId?: string;
}): Promise<string> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'users',
      title: `User - ${userData.email}`,
      metadata: {
        email: userData.email,
        password: userData.hashedPassword,
        plan: userData.plan,
        stripe_customer_id: userData.stripeCustomerId || '',
        subscription_status: userData.plan === 'pro' ? 'active' : '',
        created_at: new Date().toISOString(),
      }
    });
    
    return response.object.id;
  } catch (error) {
    throw new Error('Failed to create user record');
  }
}

// Find user by email
export async function findUserByEmail(email: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'users',
        'metadata.email': email 
      })
      .props(['id', 'title', 'metadata'])
      .depth(1);
    
    return response.objects[0] || null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to find user');
  }
}

// Update user record
export async function updateUser(userId: string, updates: {
  plan?: string;
  stripeCustomerId?: string;
  subscriptionStatus?: string;
}): Promise<void> {
  try {
    const metadata: Record<string, any> = {};
    
    if (updates.plan) {
      metadata.plan = updates.plan;
    }
    if (updates.stripeCustomerId) {
      metadata.stripe_customer_id = updates.stripeCustomerId;
    }
    if (updates.subscriptionStatus) {
      metadata.subscription_status = updates.subscriptionStatus;
    }
    
    await cosmic.objects.updateOne(userId, { metadata });
  } catch (error) {
    throw new Error('Failed to update user record');
  }
}