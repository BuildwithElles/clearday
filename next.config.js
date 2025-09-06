/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    // Optimize memory usage and bundle size
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-tabs',
      '@radix-ui/react-select',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-switch'
    ],
  },
  images: {
    domains: ['supabase.co'],
    // Optimize images
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Optimize build performance
  swcMinify: true,
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Bundle analyzer can be enabled with ANALYZE=true environment variable
  // Temporarily disabled to avoid build issues
  // Reduce memory usage during development
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Reduce memory usage in development
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      }
    }

    // Tree shaking optimizations temporarily disabled for testing
    // if (!dev) {
    //   config.optimization = {
    //     ...config.optimization,
    //     usedExports: true,
    //     sideEffects: true,
    //     splitChunks: {
    //       chunks: 'all',
    //       cacheGroups: {
    //         vendor: {
    //           test: /[\\/]node_modules[\\/]/,
    //           name: 'vendors',
    //           chunks: 'all',
    //         },
    //       },
    //     },
    //   };
    // }

    return config
  },
}

module.exports = nextConfig