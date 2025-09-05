import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Search, ArrowLeft, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Compass className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">404</CardTitle>
          <CardDescription className="text-lg">
            Oops! The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            It seems you've ventured into uncharted territory. Don't worry,
            let's get you back on track!
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/today">
                <Home className="mr-2 h-4 w-4" />
                Go to Today
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/calendar">
                <Search className="mr-2 h-4 w-4" />
                Browse Calendar
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-medium text-sm mb-2">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/tasks"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Tasks
              </Link>
              <Link
                href="/habits"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Habits
              </Link>
              <Link
                href="/progress"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Progress
              </Link>
              <Link
                href="/settings"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Settings
              </Link>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
