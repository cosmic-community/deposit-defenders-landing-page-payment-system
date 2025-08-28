import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getLandingPage } from '@/lib/cosmic'
import CosmicBadge from '@/components/CosmicBadge'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const landingPage = await getLandingPage()
  
  return {
    title: landingPage?.metadata?.meta_title || 'Deposit Defenders - Never Lose Your Security Deposit Again',
    description: landingPage?.metadata?.meta_description || 'Track and defend your rental security deposits with automated reminders, documentation tools, and legal templates.',
    keywords: 'security deposit, rental deposit, tenant rights, property management, deposit protection',
    authors: [{ name: 'Deposit Defenders' }],
    openGraph: {
      title: landingPage?.metadata?.meta_title || 'Deposit Defenders - Never Lose Your Security Deposit Again',
      description: landingPage?.metadata?.meta_description || 'Track and defend your rental security deposits with automated reminders, documentation tools, and legal templates.',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: landingPage?.metadata?.meta_title || 'Deposit Defenders - Never Lose Your Security Deposit Again',
      description: landingPage?.metadata?.meta_description || 'Track and defend your rental security deposits with automated reminders, documentation tools, and legal templates.',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <head>
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js"></script>
      </head>
      <body className={inter.className}>
        <main className="min-h-screen">
          {children}
        </main>
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}