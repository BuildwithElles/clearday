import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DailySummaryProps {
  isLoading?: boolean
}

export function DailySummary({ isLoading = false }: DailySummaryProps) {
  if (isLoading) {
    return (
      <Card data-testid="daily-summary">
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
            <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card data-testid="daily-summary">
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
        <CardDescription>Your day, already sorted</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Welcome to your personalized daily overview. Your AI assistant is analyzing your schedule and tasks to provide insights and recommendations.
        </p>
      </CardContent>
    </Card>
  )
}
