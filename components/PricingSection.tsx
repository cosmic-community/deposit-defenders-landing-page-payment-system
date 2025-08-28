import Link from 'next/link'
import type { PricingTier } from '@/types'

interface PricingSectionProps {
  pricingTiers: PricingTier[]
}

export default function PricingSection({ pricingTiers }: PricingSectionProps) {
  if (!pricingTiers || pricingTiers.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Protection Level
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free or upgrade to Pro for complete deposit protection. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => {
            const features = tier.metadata?.features?.split('\n').filter(Boolean) || []
            const isFeatured = tier.metadata?.is_featured || false
            
            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl p-8 ${
                  isFeatured
                    ? 'bg-primary-600 text-white ring-4 ring-primary-200 transform scale-105'
                    : 'bg-white text-gray-900 ring-1 ring-gray-200'
                }`}
              >
                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Tier Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">
                    {tier.metadata?.tier_name || tier.title}
                  </h3>
                  <div className="flex items-center justify-center">
                    <span className="text-5xl font-bold">
                      {tier.metadata?.price_display?.split('/')[0] || '$0'}
                    </span>
                    <span className={`ml-2 ${isFeatured ? 'text-primary-200' : 'text-gray-500'}`}>
                      /{tier.metadata?.price_display?.split('/')[1] || 'month'}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg 
                        className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 ${
                          isFeatured ? 'text-primary-200' : 'text-primary-500'
                        }`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{feature.trim()}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={tier.metadata?.cta_link || '/signup'}
                  className={`block w-full text-center py-4 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                    isFeatured
                      ? 'bg-white text-primary-600 hover:bg-gray-100'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {tier.metadata?.cta_text || 'Get Started'}
                </Link>

                {/* Additional Info */}
                {tier.metadata?.tier_name?.toLowerCase() === 'pro' && (
                  <p className={`text-center text-sm mt-4 ${
                    isFeatured ? 'text-primary-200' : 'text-gray-500'
                  }`}>
                    14-day free trial • No setup fees
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I switch plans later?</h4>
              <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a cancellation fee?</h4>
              <p className="text-gray-600 text-sm">No cancellation fees. You can cancel anytime and keep access until your current billing period ends.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm">We accept all major credit cards and debit cards through our secure payment processor Stripe.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}