import type { LandingPage } from '@/types'

interface ProblemStatementProps {
  landingPage: LandingPage
}

export default function ProblemStatement({ landingPage }: ProblemStatementProps) {
  const { problem_statement } = landingPage.metadata

  if (!problem_statement) {
    return null
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div 
          className="prose prose-lg prose-primary max-w-none"
          dangerouslySetInnerHTML={{ __html: problem_statement }}
          style={{
            '--tw-prose-headings': '#1f2937',
            '--tw-prose-p': '#4b5563',
            '--tw-prose-strong': '#111827',
            '--tw-prose-bullets': '#16a34a',
            '--tw-prose-counters': '#16a34a',
          } as React.CSSProperties}
        />
        
        {/* Visual Elements */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lost Documentation</h3>
            <p className="text-gray-600">No photos or records of property condition at move-in</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Missed Deadlines</h3>
            <p className="text-gray-600">Critical notice periods and follow-up dates forgotten</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Solution</h3>
            <p className="text-gray-600">Complete protection system with automated tracking</p>
          </div>
        </div>
      </div>
    </section>
  )
}