'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

const signupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

interface SignupFormProps {
  action?: (formData: FormData) => Promise<{ error?: string; success?: boolean; user?: any } | void>
  onSubmit?: (data: SignupFormData) => Promise<{ error?: string; success?: boolean } | void>
  isLoading?: boolean
  error?: string | null
}

export default function SignupForm({ action, onSubmit, isLoading = false, error: initialError }: SignupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(initialError || null)

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    mode: 'onBlur',
  })

  const handleSubmit = async (data: SignupFormData) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      if (action) {
        // Use server action
        const formData = new FormData()
        formData.append('email', data.email)
        formData.append('password', data.password)
        formData.append('fullName', data.fullName)

        const result = await action(formData)

        if (result && result.error) {
          setError(result.error)
        } else if (result && result.success) {
          setError(null)
          // Success will be handled by redirect in server action
        }
      } else if (onSubmit) {
        // Use traditional onSubmit
        const result = await onSubmit(data)

        // Handle the response from the server action
        if (result && result.error) {
          // Set the error to display in the form
          setError(result.error)
        } else if (result && result.success) {
          // Clear any previous errors on success
          setError(null)
          // TODO: Redirect to login or dashboard in Task #36
        }
      }
    } catch (err) {
      console.error('Signup form submission error:', err)
      setError('An unexpected error occurred')
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

        {/* Full Name Field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  disabled={isFormSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder="Create a password"
                  disabled={isFormSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters long
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  disabled={isFormSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Terms and Conditions */}
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  disabled={isFormSubmitting}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  I agree to the{' '}
                  <a
                    href="/terms"
                    className="text-primary hover:text-primary/80 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a
                    href="/privacy"
                    className="text-primary hover:text-primary/80 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </FormLabel>
                <FormMessage />
              </div>
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
              <span>Creating account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </Button>

        {/* Form State Debug (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 text-xs text-gray-500 bg-gray-50 rounded border">
            <div>Form State: {form.formState.isValid ? 'Valid' : 'Invalid'}</div>
            <div>Errors: {Object.keys(form.formState.errors).length}</div>
            <div>Dirty: {form.formState.isDirty ? 'Yes' : 'No'}</div>
            <div>Password Match: {form.watch('password') === form.watch('confirmPassword') ? 'Yes' : 'No'}</div>
          </div>
        )}
      </form>
    </Form>
  )
}
