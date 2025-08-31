import { Button } from '@/components/ui/button'
import { Header } from '@/components/layouts/header'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
              Your day, already sorted
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              Privacy-first AI that organizes your life without compromising your data. 
              Get personalized nudges, adaptive reminders, and seamless calendar integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="min-w-[200px]">
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Learn More
              </Button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Organization</h3>
              <p className="text-slate-600">
                Smart suggestions and adaptive reminders that learn from your behavior
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-slate-600">
                Your data stays private with local processing and transparent controls
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Impact Tracking</h3>
              <p className="text-slate-600">
                See your environmental impact and build sustainable habits
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}