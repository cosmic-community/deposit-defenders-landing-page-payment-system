import Link from 'next/link'
import type { LandingPage } from '@/types'

interface HeroProps {
  landingPage: LandingPage
}

export default function Hero({ landingPage }: HeroProps) {
  const {
    hero_headline,
    hero_subheading,
    primary_cta_text,
    primary_cta_link,
    secondary_cta_text,
    secondary_cta_link
  } = landingPage.metadata

  return (
    <section className="bg-gradient-to-br from-primary-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-8">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Trusted by thousands of renters
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {hero_headline || 'Never Lose a Security Deposit Again'}
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto">
            {hero_subheading || 'Track, document, and defend your rental deposits with automated reminders, photo evidence, and legal templates.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href={primary_cta_link || '/signup'}
              className="btn-primary inline-flex items-center px-8 py-4 text-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {primary_cta_text || 'Start Protecting My Deposit'}
            </Link>
            
            <Link 
              href={secondary_cta_link || '/login'}
              className="btn-secondary inline-flex items-center px-8 py-4 text-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {secondary_cta_text || 'Login'}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">$2.1M+</div>
              <div className="text-sm text-gray-600">Deposits Recovered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">15,000+</div>
              <div className="text-sm text-gray-600">Properties Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}