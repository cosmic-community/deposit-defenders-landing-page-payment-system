import { Suspense } from 'react'
import Hero from '@/components/Hero'
import ProblemStatement from '@/components/ProblemStatement'
import PricingSection from '@/components/PricingSection'
import CallToAction from '@/components/CallToAction'
import { getLandingPage, getPricingTiers } from '@/lib/cosmic'

export default async function HomePage() {
  const [landingPage, pricingTiers] = await Promise.all([
    getLandingPage(),
    getPricingTiers()
  ])

  if (!landingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Landing page content not found
          </h1>
          <p className="text-gray-600">
            Please check your Cosmic CMS configuration.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-screen bg-gray-50 animate-pulse" />}>
        <Hero landingPage={landingPage} />
      </Suspense>
      
      <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse" />}>
        <ProblemStatement landingPage={landingPage} />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
        <PricingSection pricingTiers={pricingTiers} />
      </Suspense>
      
      <Suspense fallback={<div className="h-32 bg-gray-50 animate-pulse" />}>
        <CallToAction landingPage={landingPage} />
      </Suspense>
    </div>
  )
}