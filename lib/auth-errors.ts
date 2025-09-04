// Auth error handling utilities

export interface AuthError {
  code: string
  message: string
  userMessage: string
  field?: string
}

export function parseAuthError(error: any): AuthError {
  // Handle Supabase auth errors
  if (error?.message) {
    const message = error.message.toLowerCase()

    // Email confirmation required (check this first as it's more specific)
    if (message.includes('email not confirmed') ||
        message.includes('confirmation required')) {
      return {
        code: 'EMAIL_CONFIRMATION_REQUIRED',
        message: error.message,
        userMessage: 'Please check your email and click the confirmation link before signing in.',
        field: 'email'
      }
    }

    // Invalid credentials
    if (message.includes('invalid login credentials') ||
        message.includes('invalid email or password')) {
      return {
        code: 'INVALID_CREDENTIALS',
        message: error.message,
        userMessage: 'Invalid email or password. Please check your credentials and try again.',
        field: 'email'
      }
    }

    // Email already registered
    if (message.includes('user already registered') ||
        message.includes('email address is already registered')) {
      return {
        code: 'EMAIL_EXISTS',
        message: error.message,
        userMessage: 'An account with this email already exists. Try signing in instead.',
        field: 'email'
      }
    }

    // Weak password
    if (message.includes('password should be at least') ||
        message.includes('weak password')) {
      return {
        code: 'WEAK_PASSWORD',
        message: error.message,
        userMessage: 'Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.',
        field: 'password'
      }
    }

    // Invalid email format
    if (message.includes('invalid email') ||
        message.includes('email address is invalid')) {
      return {
        code: 'INVALID_EMAIL',
        message: error.message,
        userMessage: 'Please enter a valid email address.',
        field: 'email'
      }
    }

    // Too many requests
    if (message.includes('too many requests') ||
        message.includes('rate limit')) {
      return {
        code: 'RATE_LIMIT',
        message: error.message,
        userMessage: 'Too many attempts. Please wait a few minutes before trying again.',
      }
    }

    // Network errors
    if (message.includes('network') ||
        message.includes('fetch') ||
        message.includes('connection')) {
      return {
        code: 'NETWORK_ERROR',
        message: error.message,
        userMessage: 'Network error. Please check your connection and try again.',
      }
    }

    // Signup disabled
    if (message.includes('signup is disabled') ||
        message.includes('registration disabled')) {
      return {
        code: 'SIGNUP_DISABLED',
        message: error.message,
        userMessage: 'New account registration is currently disabled. Please contact support.',
      }
    }
  }

  // Handle generic errors
  if (error?.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return {
          code: 'USER_NOT_FOUND',
          message: error.message || 'User not found',
          userMessage: 'No account found with this email address.',
          field: 'email'
        }
      case 'auth/wrong-password':
        return {
          code: 'WRONG_PASSWORD',
          message: error.message || 'Wrong password',
          userMessage: 'Incorrect password. Please try again.',
          field: 'password'
        }
      case 'auth/too-many-requests':
        return {
          code: 'TOO_MANY_REQUESTS',
          message: error.message || 'Too many requests',
          userMessage: 'Too many failed attempts. Please wait before trying again.',
        }
    }
  }

  // Default error
  return {
    code: 'UNKNOWN_ERROR',
    message: error?.message || 'Unknown error',
    userMessage: 'An unexpected error occurred. Please try again.',
  }
}

export function getAuthErrorMessage(error: any): string {
  const parsedError = parseAuthError(error)
  return parsedError.userMessage
}

export function getAuthErrorField(error: any): string | undefined {
  const parsedError = parseAuthError(error)
  return parsedError.field
}

// Validation error messages
export const validationErrors = {
  required: (field: string) => `${field} is required`,
  email: 'Please enter a valid email address',
  passwordMin: 'Password must be at least 8 characters',
  passwordMismatch: "Passwords don't match",
  termsRequired: 'You must accept the terms and conditions',
}

// Network error detection
export function isNetworkError(error: any): boolean {
  if (!error) return false

  const message = error.message?.toLowerCase() || ''
  return message.includes('network') ||
         message.includes('fetch') ||
         message.includes('connection') ||
         message.includes('timeout') ||
         error.name === 'NetworkError' ||
         error.name === 'TypeError'
}

// Retry logic for network errors
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (!isNetworkError(error) || i === maxRetries - 1) {
        throw error
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
    }
  }

  throw lastError
}
