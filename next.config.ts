import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // React
  reactStrictMode: true,

  // Optimizaciones
  compress: true,

  // Experimental features
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gydi-assets.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'gydi-profile-images.s3.amazonaws.com', // AWS S3 Producción
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Desarrollo local
        port: '8080',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ============================================
  // Security Headers (OWASP Recommended)
  // ============================================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // ============================================
          // Content Security Policy (CSP)
          // ============================================
          // Prevents XSS attacks by controlling which resources can be loaded
          {
            key: 'Content-Security-Policy',
            value: [
              // Default: Only load resources from same origin
              "default-src 'self'",

              // Scripts: Allow Next.js inline scripts + eval (required for dev)
              // In production, Next.js uses nonces for inline scripts
              // Allow Stripe.js for payment processing
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",

              // Styles: Allow inline styles (Tailwind generates inline styles)
              "style-src 'self' 'unsafe-inline'",

              // Images: Allow self, data URLs, S3, and backend API
              `img-src 'self' data: https: blob: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}`,

              // Media: Allow videos from backend API
              `media-src 'self' blob: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}`,

              // Fonts: Only from same origin
              "font-src 'self'",

              // API/AJAX: Allow backend API and Stripe API
              `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'} https://api.stripe.com`,

              // Frames: Deny all iframes from loading this site
              // Allow Stripe iframes for secure payment elements
              "frame-ancestors 'none'",
              "frame-src 'self' https://js.stripe.com",

              // Base URI: Restrict base tag
              "base-uri 'self'",

              // Forms: Only submit to same origin
              "form-action 'self'",

              // Upgrade insecure requests in production
              process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests' : '',
            ]
              .filter(Boolean)
              .join('; '),
          },

          // ============================================
          // X-Frame-Options
          // ============================================
          // Prevents clickjacking by disabling iframe embedding
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },

          // ============================================
          // X-Content-Type-Options
          // ============================================
          // Prevents MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          // ============================================
          // X-XSS-Protection
          // ============================================
          // Legacy XSS protection (modern browsers use CSP)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },

          // ============================================
          // Referrer-Policy
          // ============================================
          // Controls how much referrer information is sent
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          // ============================================
          // Strict-Transport-Security (HSTS)
          // ============================================
          // Forces HTTPS connections (only in production)
          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains; preload',
                },
              ]
            : []),

          // ============================================
          // Permissions-Policy
          // ============================================
          // Controls which browser features/APIs can be used
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',        // Disable camera access
              'microphone=()',    // Disable microphone access
              'geolocation=()',   // Disable geolocation
              'payment=(self)',   // Allow Payment Request API (Apple Pay, Google Pay, etc.)
              'usb=()',          // Disable USB access
              'magnetometer=()',  // Disable magnetometer
              'gyroscope=()',    // Disable gyroscope
              'accelerometer=()', // Disable accelerometer
            ].join(', '),
          },
        ],
      },
    ];
  },

  // Rewrites (proxy a backend)
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ];
  },
};

export default nextConfig;
