'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  action?: (formData: FormData) => Promise<{ error?: string; success?: boolean; user?: any; field?: string } | void>
  onSubmit?: (data: LoginFormData) => void | Promise<void>
  isLoading?: boolean
  error?: string | null
  fieldError?: string | null
}

export default function LoginForm({ action, onSubmit, isLoading = false, error: initialError, fieldError }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(initialError || null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const handleSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      if (action) {
        // Use server action
        const formData = new FormData()
        formData.append('email', data.email)
        formData.append('password', data.password)
        
        const result = await action(formData)
        
        if (result && result.error) {
          setError(result.error)
          if (result.field) {
            setFieldErrors({ [result.field]: result.error })
          }
        } else if (result && result.success) {
          setError(null)
          setFieldErrors({})
          // Success will be handled by redirect in server action
        }
      } else if (onSubmit) {
        // Use traditional onSubmit
        await onSubmit(data)
      }
    } catch (err) {
      console.error('Login form submission error:', err)
      
      // Check if this is a NEXT_REDIRECT error (expected for successful login)
      if (err && typeof err === 'object' && 'digest' in err && 
          typeof err.digest === 'string' && err.digest.startsWith('NEXT_REDIRECT')) {
        // This is expected - the redirect will happen automatically
        console.log('Login successful, redirecting...')
        return
      }
      
      setError('An unexpected error occurred. Please try again.')
      setFieldErrors({})
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormSubmitting = isLoading || isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  disabled={isFormSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {fieldErrors.email && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  disabled={isFormSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {fieldErrors.password && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>
              )}
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isFormSubmitting}
        >
          {isFormSubmitting ? (
            <div className="flex items-center space-x-2">
              <Spinner size="sm" className="text-white" />
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Form State Debug (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 text-xs text-gray-500 bg-gray-50 rounded border">
            <div>Form State: {form.formState.isValid ? 'Valid' : 'Invalid'}</div>
            <div>Errors: {Object.keys(form.formState.errors).length}</div>
            <div>Dirty: {form.formState.isDirty ? 'Yes' : 'No'}</div>
          </div>
        )}
      </form>
    </Form>
  )
}
