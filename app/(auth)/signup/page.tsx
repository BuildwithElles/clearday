export default function SignupPage() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Create Account</h1>
      <p className="text-slate-600 mb-8">Join ClearDay and get organized</p>
      
      <div className="space-y-4">
        <div className="text-left">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="text-left">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="text-left">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Create Account
        </button>
      </div>
      
      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:text-blue-700">
          Sign in
        </a>
      </p>
    </div>
  )
}
