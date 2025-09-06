import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AnalyticsProvider } from '@/components/AnalyticsProvider'
import '@/lib/vitals' // Initialize Web Vitals tracking

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ClearDay - Your day, already sorted',
    template: '%s | ClearDay'
  },
  description: 'Privacy-first, AI-powered life organizer that helps you manage your calendar, tasks, and habits with complete data ownership and intelligent automation.',
  keywords: ['productivity', 'calendar', 'tasks', 'habits', 'AI', 'privacy', 'life organizer', 'task management', 'habit tracker'],
  authors: [{ name: 'ClearDay Team' }],
  creator: 'ClearDay',
  publisher: 'ClearDay',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://clearday.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ClearDay - Your day, already sorted',
    description: 'Privacy-first, AI-powered life organizer that helps you manage your calendar, tasks, and habits with complete data ownership and intelligent automation.',
    url: 'https://clearday.app',
    siteName: 'ClearDay',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'ClearDay - Privacy-first AI life organizer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClearDay - Your day, already sorted',
    description: 'Privacy-first, AI-powered life organizer that helps you manage your calendar, tasks, and habits with complete data ownership and intelligent automation.',
    images: ['/og-image.svg'],
    creator: '@clearday',
    site: '@clearday',
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
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'productivity',
}

// Force dynamic rendering to avoid static generation issues with client components
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ClearDay" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="clearday-ui-theme"
        >
          <AnalyticsProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <Toaster />
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}