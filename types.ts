// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Landing page content type
export interface LandingPage extends CosmicObject {
  type: 'landing-pages';
  metadata: {
    page_title?: string;
    hero_headline?: string;
    hero_subheading?: string;
    problem_statement?: string;
    primary_cta_text?: string;
    primary_cta_link?: string;
    secondary_cta_text?: string;
    secondary_cta_link?: string;
    meta_title?: string;
    meta_description?: string;
  };
}

// Pricing tier content type
export interface PricingTier extends CosmicObject {
  type: 'pricing-tiers';
  metadata: {
    tier_name?: string;
    price_display?: string;
    features?: string;
    is_featured?: boolean;
    cta_text?: string;
    cta_link?: string;
    display_order?: number;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// User types for authentication
export interface User {
  id: string;
  email: string;
  plan: 'free' | 'pro';
  stripeCustomerId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due';
  createdAt: string;
}

export interface SignupData {
  email: string;
  password: string;
  plan: 'free' | 'pro';
}

export interface LoginData {
  email: string;
  password: string;
}

// Payment types
export interface PaymentIntentData {
  amount: number;
  currency: string;
  email: string;
  plan: string;
}

export interface SubscriptionData {
  email: string;
  paymentMethodId: string;
  plan: 'pro';
}

// Form validation types
export interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// JWT payload type
export interface JWTPayload {
  userId: string;
  email: string;
  plan: string;
  iat: number;
  exp: number;
}

// Type guards
export function isLandingPage(obj: CosmicObject): obj is LandingPage {
  return obj.type === 'landing-pages';
}

export function isPricingTier(obj: CosmicObject): obj is PricingTier {
  return obj.type === 'pricing-tiers';
}

// Utility types
export type CreateUserData = Omit<User, 'id' | 'createdAt'>;
export type UpdateUserData = Partial<Pick<User, 'plan' | 'stripeCustomerId' | 'subscriptionStatus'>>;