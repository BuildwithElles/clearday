'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Calendar,
  CheckSquare,
  Home,
  Settings,
  Target,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react'

const navigation = [
  {
    name: 'Today',
    href: '/today',
    icon: Home,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
  },
  {
    name: 'Habits',
    href: '/habits',
    icon: Target,
  },
  {
    name: 'Progress',
    href: '/progress',
    icon: TrendingUp,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-9 w-9 p-0 md:hidden',
            className
          )}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">ClearDay</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      'flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground w-full',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t">
            <div className="text-xs text-muted-foreground text-center">
              <p>ClearDay v1.0</p>
              <p className="mt-1">Privacy-first task management</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Mobile navigation trigger button (can be used separately)
export function MobileNavTrigger({ className }: { className?: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'h-9 w-9 p-0 md:hidden',
        className
      )}
      aria-label="Open navigation menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}

// Compact mobile navigation for bottom tabs (alternative approach)
export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {navigation.slice(0, 5).map((item) => { // Limit to 5 items for mobile
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs truncate">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}



