'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void | Promise<void>
  isLoading?: boolean
  error?: string | null
}

export default function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const handleSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      if (onSubmit) {
        await onSubmit(data)
      }
    } catch (err) {
      console.error('Login form submission error:', err)
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
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
