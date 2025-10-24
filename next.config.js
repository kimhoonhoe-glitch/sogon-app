/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  allowedDevOrigins: [
    'localhost:5000',
    '127.0.0.1:5000',
    '*.replit.dev',
    '*.worf.replit.dev',
    process.env.REPLIT_DOMAINS,
  ].filter(Boolean),
}

module.exports = nextConfig
