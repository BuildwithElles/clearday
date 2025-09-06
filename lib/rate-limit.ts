interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();

  constructor(private options: RateLimitOptions) {}

  async check(identifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    message?: string;
  }> {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // Clean up expired entries
    if (entry && now > entry.resetTime) {
      this.store.delete(identifier);
    }

    const currentEntry = this.store.get(identifier);

    if (!currentEntry) {
      // First request in window
      const resetTime = now + this.options.windowMs;
      this.store.set(identifier, { count: 1, resetTime });

      return {
        allowed: true,
        remaining: this.options.maxRequests - 1,
        resetTime,
      };
    }

    if (currentEntry.count >= this.options.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: currentEntry.resetTime,
        message: this.options.message || 'Too many requests, please try again later.',
      };
    }

    // Increment counter
    currentEntry.count++;
    this.store.set(identifier, currentEntry);

    return {
      allowed: true,
      remaining: this.options.maxRequests - currentEntry.count,
      resetTime: currentEntry.resetTime,
    };
  }

  // Clean up expired entries (can be called periodically)
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.store.forEach((entry, key) => {
      if (now > entry.resetTime) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.store.delete(key));
  }
}

// Global rate limiter instances for different use cases
const rateLimiters = {
  // General API rate limiting
  api: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    message: 'Too many API requests. Please try again in a minute.',
  }),

  // Authentication rate limiting (stricter)
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 auth attempts per 15 minutes
    message: 'Too many authentication attempts. Please try again later.',
  }),

  // Task operations rate limiting
  tasks: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 task operations per minute
    message: 'Too many task operations. Please slow down.',
  }),

  // General form submissions
  forms: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 form submissions per minute
    message: 'Too many form submissions. Please try again in a minute.',
  }),
};

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  Object.values(rateLimiters).forEach(limiter => limiter.cleanup());
}, 5 * 60 * 1000); // Clean up every 5 minutes

export { rateLimiters };
export type { RateLimitOptions };

// Helper function to get client identifier
export function getClientIdentifier(request?: Request): string {
  // Try to get IP address
  const forwarded = request?.headers?.get('x-forwarded-for');
  const realIp = request?.headers?.get('x-real-ip');
  const cfConnectingIp = request?.headers?.get('cf-connecting-ip');

  const ip = forwarded?.split(',')[0]?.trim() ||
             realIp ||
             cfConnectingIp ||
             'unknown';

  // For development, use a simple identifier
  if (process.env.NODE_ENV === 'development') {
    return `dev-${ip}`;
  }

  return ip;
}

// Rate limiting middleware for Next.js API routes
export async function withRateLimit(
  handler: (request: Request, ...args: any[]) => Promise<Response>,
  limiter: keyof typeof rateLimiters = 'api',
  getIdentifier?: (request: Request) => string
) {
  return async (request: Request, ...args: any[]) => {
    const identifier = getIdentifier
      ? getIdentifier(request)
      : getClientIdentifier(request);

    const result = await rateLimiters[limiter].check(identifier);

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: result.message,
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString(),
          },
        }
      );
    }

    // Add rate limit headers to successful response
    const response = await handler(request, ...args);

    // Clone the response to add headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    newResponse.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    newResponse.headers.set('X-RateLimit-Reset', result.resetTime.toString());

    return newResponse;
  };
}

// Rate limiting wrapper for server actions
export async function rateLimitAction<T>(
  action: () => Promise<T>,
  limiter: keyof typeof rateLimiters = 'api',
  identifier: string = 'server-action'
): Promise<T> {
  const result = await rateLimiters[limiter].check(identifier);

  if (!result.allowed) {
    throw new Error(result.message || 'Rate limit exceeded');
  }

  return action();
}

// Rate limiting hook for client-side
export function useRateLimit() {
  return {
    checkRateLimit: async (identifier: string, limiter: keyof typeof rateLimiters = 'api') => {
      return await rateLimiters[limiter].check(identifier);
    },
  };
}
