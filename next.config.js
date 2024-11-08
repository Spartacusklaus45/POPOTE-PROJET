/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    optimizePackageImports: ['@mui/icons-material']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // Configuration des variables d'environnement publiques uniquement
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL
  }
};

module.exports = nextConfig;