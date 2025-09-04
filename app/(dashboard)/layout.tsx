import { AuthProvider } from '@/components/auth/AuthProvider'
import { DashboardNav } from '@/components/layouts/DashboardNav'
import { UserMenu } from '@/components/layouts/UserMenu'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 hidden md:flex">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">CD</span>
                </div>
                <span className="hidden font-bold sm:inline-block">
                  ClearDay
                </span>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="w-full flex-1 md:w-auto md:flex-none">
                {/* Search could go here in the future */}
              </div>
              <nav className="flex items-center">
                <UserMenu />
              </nav>
            </div>
          </div>
        </header>

        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          {/* Sidebar */}
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <div className="h-full py-6 pl-8 pr-6 lg:py-8">
              <DashboardNav />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex w-full flex-col overflow-hidden">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
