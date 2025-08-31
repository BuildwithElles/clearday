import Link from 'next/link'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header with Logo */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            {/* Logo - Centered */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CD</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">ClearDay</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            {children}
          </div>
          
          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-slate-600 hover:text-slate-900 transition-colors text-sm"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-slate-600">
            <p>© 2024 ClearDay. Your day, already sorted.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
