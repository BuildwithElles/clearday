import { Spinner } from '@/components/ui/spinner'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Spinner size="lg" className="mx-auto text-primary" />
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  )
}
