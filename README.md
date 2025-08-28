# Deposit Defenders - Landing Page & Payment System

![Deposit Defenders Preview](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=300&fit=crop&auto=format)

A comprehensive landing page application for Deposit Defenders that helps renters protect and recover their security deposits. Features dynamic pricing tiers, integrated Stripe payments, and seamless user authentication.

## ✨ Features

- **Dynamic Content Management** - All content powered by Cosmic CMS
- **Stripe Payment Integration** - Secure payment processing for Pro tier subscriptions
- **User Authentication** - JWT-based login/signup system with secure session management
- **Responsive Pricing Tiers** - Dynamic pricing comparison with featured plan highlighting
- **Email Notifications** - Automated emails for signups and successful payments via Resend
- **SEO Optimized** - Dynamic meta tags and structured data
- **Mobile-First Design** - Fully responsive across all devices
- **Real-time Form Validation** - Client and server-side validation for all forms

<!-- CLONE_PROJECT_BUTTON -->

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "I want to build a simple landing page for my Deposit Defenders application. The landing page should be to provide a little information about why this type of application exists, show the free tier and paid tier pricing and allow the user to sign up and also log in."

### Code Generation Prompt

> Build a landing page for the Deposit Defenders application. Allow people to sign up for the free tier or the paid tier (and pay for it). They should also be able to log in

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🚀 Technologies Used

- **Framework**: Next.js 15 with App Router
- **Content Management**: Cosmic CMS
- **Payment Processing**: Stripe
- **Email Service**: Resend
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Database**: Cosmic CMS (headless)
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- Bun package manager
- Cosmic account and bucket
- Stripe account (for payments)
- Resend account (for emails)

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd deposit-defenders-landing
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**
Copy the environment variables and add your API keys:
- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket slug
- `COSMIC_READ_KEY` - Your Cosmic read key  
- `COSMIC_WRITE_KEY` - Your Cosmic write key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `RESEND_API_KEY` - Your Resend API key
- `JWT_SECRET` - JWT secret for authentication (minimum 32 characters)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key for client

4. **Run the development server**
```bash
bun dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Cosmic SDK Examples

### Fetch Landing Page Content
```typescript
import { cosmic } from '@/lib/cosmic'

export async function getLandingPage() {
  try {
    const response = await cosmic.objects
      .find({ type: 'landing-pages' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects[0] || null
  } catch (error) {
    if (error.status === 404) {
      return null
    }
    throw error
  }
}
```

### Fetch Pricing Tiers
```typescript
export async function getPricingTiers() {
  try {
    const response = await cosmic.objects
      .find({ type: 'pricing-tiers' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects.sort((a, b) => 
      (a.metadata?.display_order || 0) - (b.metadata?.display_order || 0)
    )
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    throw error
  }
}
```

## 🌐 Cosmic CMS Integration

This application uses the following Cosmic object types:

### Landing Pages
- **page_title**: Main page title
- **hero_headline**: Hero section headline
- **hero_subheading**: Supporting hero text
- **problem_statement**: HTML content explaining why the app exists
- **primary_cta_text**: Sign up button text
- **primary_cta_link**: Sign up URL
- **secondary_cta_text**: Login button text
- **secondary_cta_link**: Login URL
- **meta_title**: SEO title
- **meta_description**: SEO description

### Pricing Tiers
- **tier_name**: Plan name (Free, Pro, etc.)
- **price_display**: Price text ($0/month, $19/month)
- **features**: List of features (one per line)
- **is_featured**: Boolean to highlight the tier
- **cta_text**: Call-to-action button text
- **cta_link**: CTA button destination
- **display_order**: Sort order for display

## 🚀 Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the project: `bun run build`
2. Deploy the `out` folder to Netlify
3. Add environment variables in Netlify dashboard

### Environment Variables for Production
Set these variables in your hosting platform:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY` 
- `COSMIC_WRITE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `JWT_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

The application will automatically handle payment processing, user authentication, and email notifications in production.
